import React from 'react';
import { Button, Segment, Popup } from 'semantic-ui-react';
import { useIntl, defineMessages } from 'react-intl';
import cx from 'classnames';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { flattenToAppURL, getContentIcon } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

import rightArrowSVG from '@plone/volto/icons/right-key.svg';
import homeSVG from '@plone/volto/icons/home.svg';

const messages = defineMessages({
  browse: {
    id: 'Browse',
    defaultMessage: 'Browse',
  },
  select: {
    id: 'Select',
    defaultMessage: 'Select',
  },
});

const ObjectBrowserNav = ({
  currentSearchResults,
  selected,
  handleClickOnItem,
  handleDoubleClickOnItem,
  mode,
  navigateTo,
  isSelectable,
}) => {
  const intl = useIntl();
  const isSelected = (item) => {
    let ret = false;
    if (selected) {
      selected
        .filter((item) => item != null)
        .forEach((_item) => {
          if (flattenToAppURL(_item['@id']) === flattenToAppURL(item['@id'])) {
            ret = true;
          }
        });
    }
    return ret;
  };

  return (
    <Segment as="ul" className="object-listing">
      {currentSearchResults &&
        currentSearchResults.items.map((item) => (
          <li
            role="presentation"
            aria-label={
              item.is_folderish && mode === 'image'
                ? `${intl.formatMessage(messages.browse)} ${item.title}`
                : `${intl.formatMessage(messages.select)} ${item.title}`
            }
            key={item['@id']}
            className={cx('', {
              'selected-item': isSelected(item),

              disabled:
                mode === 'image'
                  ? !config.settings.imageObjects.includes(item['@type']) &&
                    !item.is_folderish
                  : !isSelectable(item),
            })}
            onClick={() => handleClickOnItem(item)}
            onDoubleClick={() => handleDoubleClickOnItem(item)}
          >
            <span title={`${item['@id']} (${item['@type']})`}>
              <Popup
                key={item['@id']}
                content={
                  <>
                    <Icon name={homeSVG} size="18px" />{' '}
                    {flattenToAppURL(item['@id'])} ( {item['@type']})
                  </>
                }
                trigger={
                  <span>
                    <Icon
                      name={getContentIcon(item['@type'], item.is_folderish)}
                      size="24px"
                    />
                  </span>
                }
              />

              {item.title}
            </span>
            {item.is_folderish && mode === 'image' && (
              <Icon
                className="right-arrow-icon"
                name={rightArrowSVG}
                size="24px"
              />
            )}
            {item.is_folderish && (mode === 'link' || mode === 'multiple') && (
              <Button.Group>
                <Button
                  basic
                  icon
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo(item['@id']);
                  }}
                  aria-label={`${intl.formatMessage(messages.browse)} ${
                    item.title
                  }`}
                >
                  <Icon
                    className="right-arrow-icon"
                    name={rightArrowSVG}
                    size="24px"
                  />
                </Button>
              </Button.Group>
            )}
          </li>
        ))}
    </Segment>
  );
};

export default ObjectBrowserNav;
