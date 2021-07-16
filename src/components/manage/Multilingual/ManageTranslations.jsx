import React from 'react';
import { Button, Container, Segment, Table } from 'semantic-ui-react';
import { Helmet } from '@plone/volto/helpers';
import { flattenToAppURL, getBaseUrl, langmap } from '@plone/volto/helpers';
import { reduce } from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import { Icon, Toast, Toolbar } from '@plone/volto/components';
import config from '@plone/volto/registry';

import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import {
  deleteLinkTranslation,
  getContent,
  linkTranslation,
} from '@plone/volto/actions';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';
import { Portal } from 'react-portal';
import { toast } from 'react-toastify';

import addSVG from '@plone/volto/icons/add.svg';
import backSVG from '@plone/volto/icons/back.svg';
import linkSVG from '@plone/volto/icons/link.svg';
import unlinkSVG from '@plone/volto/icons/unlink.svg';

const messages = defineMessages({
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  linked: {
    id: 'Translation linked',
    defaultMessage: 'Translation linked',
  },
  unlinked: {
    id: 'Translation linking removed',
    defaultMessage: 'Translation linking removed',
  },
  link: {
    id: 'Link translation for',
    defaultMessage: 'Link translation for',
  },
  unlink: {
    id: 'Unlink translation for',
    defaultMessage: 'Unlink translation for',
  },
  ManageTranslations: {
    id: 'Manage Translations',
    defaultMessage: 'Manage Translations',
  },
  ManageTranslationsTitle: {
    id: 'Manage translations for {title}',
    defaultMessage: 'Manage translations for {title}',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
});

const ManageTranslations = (props) => {
  const intl = useIntl();
  const pathname = useLocation().pathname;
  const content = useSelector((state) => state.content.data);
  const dispatch = useDispatch();

  const { isObjectBrowserOpen, openObjectBrowser } = props;

  const currentSelectedItem = React.useRef(null);

  React.useEffect(() => {
    if (!content) {
      dispatch(getContent(getBaseUrl(pathname)));
    }
  }, [dispatch, content, pathname]);

  React.useEffect(() => {
    // Only execute the link API call on the final item selected, once the ObjectBrowser
    // is closed
    if (!isObjectBrowserOpen && currentSelectedItem.current) {
      dispatch(linkTranslation(content['@id'], currentSelectedItem.current))
        .then((resp) => {
          toast.success(
            <Toast
              success
              title={intl.formatMessage(messages.success)}
              content={intl.formatMessage(messages.linked)}
            />,
          );
          dispatch(getContent(getBaseUrl(pathname)));
        })
        .catch((error) => {
          // TODO: The true error sent by the API is shadowed by the superagent one
          // Update this when this issue is fixed.
          const shadowedError = JSON.parse(error.response.text);
          toast.error(
            <Toast
              error
              title={shadowedError.error.type}
              content={shadowedError.error.message}
            />,
            { toastId: 'linkFailed' },
          );
        });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [isObjectBrowserOpen]);

  const translations = content &&
    content['@components'].translations.items && {
      [content.language.token]: {
        url: content['@id'],
      },
      ...reduce(
        content['@components'].translations.items,
        (acc, value) => {
          return { ...acc, [value.language]: { url: value['@id'] } };
        },
        {},
      ),
    };

  function onSelectTarget(target) {
    // We store the selection temporarily on the component, because we don't want it to
    // execute it right away, since that will lead into duplicate link requests and we
    // only want the last to get through
    currentSelectedItem.current = target;
  }

  function onDeleteTranslation(lang) {
    dispatch(deleteLinkTranslation(content['@id'], lang))
      .then((resp) => {
        toast.success(
          <Toast
            success
            title={intl.formatMessage(messages.success)}
            content={intl.formatMessage(messages.unlinked)}
          />,
        );
        dispatch(getContent(getBaseUrl(pathname)));
      })
      .catch((error) => {
        // TODO: The true error sent by the API is shadowed by the superagent one
        // Update this when this issue is fixed.
        const shadowedError = JSON.parse(error.response.text);
        toast.error(
          <Toast
            error
            title={shadowedError.error.type}
            content={shadowedError.error.message}
          />,
          { toastId: 'linkFailed' },
        );
      });
  }

  return (
    <Container id="page-manage-translations">
      <Helmet title={intl.formatMessage(messages.ManageTranslations)} />
      <Segment.Group raised>
        <Segment className="primary">
          <FormattedMessage
            id="Manage translations for {title}"
            defaultMessage="Manage translations for {title}"
            values={{ title: <q>{content.title}</q> }}
          />
        </Segment>
        {content && (
          <Table selectable compact singleLine attached>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Language</Table.HeaderCell>
                <Table.HeaderCell>Path</Table.HeaderCell>
                <Table.HeaderCell textAlign="right">Tools</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {config.settings.supportedLanguages.map((lang) => (
                <Table.Row key={lang}>
                  <Table.Cell collapsing>
                    {lang === content.language.token ? (
                      <strong>{langmap[lang].nativeName}</strong>
                    ) : (
                      langmap[lang].nativeName
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={flattenToAppURL(translations[lang]?.url || '')}>
                      {flattenToAppURL(translations[lang]?.url || '')}
                    </Link>
                  </Table.Cell>
                  <Table.Cell
                    textAlign="right"
                    className="manage-multilingual-tools"
                  >
                    <Button.Group>
                      <Button
                        basic
                        icon
                        disabled={
                          lang === content.language.token ||
                          translations?.[lang]
                        }
                        as={Link}
                        to={{
                          pathname: `${pathname}/create-translation`,
                          state: {
                            type: content['@type'],
                            translationOf: flattenToAppURL(content['@id']),
                            language: lang,
                          },
                        }}
                      >
                        <Icon name={addSVG} size="24px" />
                      </Button>
                    </Button.Group>
                    {translations?.[lang] ? (
                      <Button.Group>
                        <Button
                          aria-label={`${intl.formatMessage(
                            messages.unlink,
                          )} ${langmap[lang].nativeName.toLowerCase()}`}
                          basic
                          icon
                          disabled={lang === content.language.token}
                          onClick={() => onDeleteTranslation(lang)}
                        >
                          <Icon
                            name={
                              lang === content.language.token
                                ? linkSVG
                                : unlinkSVG
                            }
                            size="24px"
                          />
                        </Button>
                      </Button.Group>
                    ) : (
                      <Button.Group>
                        <Button
                          aria-label={`${intl.formatMessage(
                            messages.link,
                          )} ${langmap[lang].nativeName.toLowerCase()}`}
                          basic
                          icon
                          disabled={lang === content.language.token}
                          onClick={() =>
                            openObjectBrowser({
                              mode: 'link',
                              overlay: true,
                              onSelectItem: (url) => {
                                onSelectTarget(url, isObjectBrowserOpen);
                              },
                            })
                          }
                        >
                          <Icon name={linkSVG} size="24px" />
                        </Button>
                      </Button.Group>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
        {__CLIENT__ && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              activity="manage-translations"
              pathname={pathname}
              hideDefaultViewButtons
              inner={
                <Link to={`${getBaseUrl(pathname)}`} className="item">
                  <Icon
                    name={backSVG}
                    className="contents circled"
                    size="30px"
                    title={intl.formatMessage(messages.back)}
                  />
                </Link>
              }
            />
          </Portal>
        )}
      </Segment.Group>
    </Container>
  );
};

export default withObjectBrowser(ManageTranslations);
