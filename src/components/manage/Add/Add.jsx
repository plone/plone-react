/**
 * Add container.
 * @module components/manage/Add/Add
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { keys, isEmpty } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { Button, Grid, Menu } from 'semantic-ui-react';
import { Portal } from 'react-portal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { v4 as uuid } from 'uuid';
import qs from 'query-string';

import { createContent, getSchema } from '@plone/volto/actions';
import {
  Form,
  Icon,
  Toolbar,
  Sidebar,
  Toast,
  toast,
  TranslationObject,
} from '@plone/volto/components';
import {
  getBaseUrl,
  hasBlocksData,
  flattenToAppURL,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  langmap,
} from '@plone/volto/helpers';

import { preloadLazyLibs } from '@plone/volto/helpers/Loadable';

import config from '@plone/volto/registry';

import saveSVG from '@plone/volto/icons/save.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  add: {
    id: 'Add {type}',
    defaultMessage: 'Add {type}',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  translateTo: {
    id: 'Translate to {lang}',
    defaultMessage: 'Translate to {lang}',
  },
});

/**
 * Add class.
 * @class Add
 * @extends Component
 */
class Add extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    createContent: PropTypes.func.isRequired,
    getSchema: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    schema: PropTypes.objectOf(PropTypes.any),
    content: PropTypes.shape({
      // eslint-disable-line react/no-unused-prop-types
      '@id': PropTypes.string,
      '@type': PropTypes.string,
    }),
    returnUrl: PropTypes.string,
    createRequest: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    schemaRequest: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    type: PropTypes.string,
    location: PropTypes.objectOf(PropTypes.any),
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    schema: null,
    content: null,
    returnUrl: null,
    type: 'Default',
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    if (config.blocks?.initialBlocks[props.type]) {
      this.initialBlocksLayout = config.blocks.initialBlocks[
        props.type
      ].map((item) => uuid());
      this.initialBlocks = this.initialBlocksLayout.reduce(
        (acc, value, index) => ({
          ...acc,
          [value]: { '@type': config.blocks.initialBlocks[props.type][index] },
        }),
        {},
      );
    }
    this.state = {
      isClient: false,
      error: null,
      formSelected: 'addForm',
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getSchema(this.props.type);
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.createRequest.loading &&
      nextProps.createRequest.loaded &&
      nextProps.content['@type'] === this.props.type
    ) {
      this.props.history.push(
        this.props.returnUrl || flattenToAppURL(nextProps.content['@id']),
      );
    }

    if (this.props.createRequest.loading && nextProps.createRequest.error) {
      const message =
        nextProps.createRequest.error.response?.body?.message ||
        nextProps.createRequest.error.response?.text;

      const error =
        new DOMParser().parseFromString(message, 'text/html')?.all[0]
          ?.textContent || message;

      this.setState({ error: error });

      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.error)}
          content={`${nextProps.createRequest.error.status}:  ${error}`}
        />,
      );
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
    this.props.createContent(getBaseUrl(this.props.pathname), {
      ...data,
      '@static_behaviors': this.props.schema.definitions
        ? keys(this.props.schema.definitions)
        : null,
      '@type': this.props.type,
      ...(config.settings.isMultilingual &&
        this.props.location?.state?.translationOf && {
          translation_of: this.props.location.state.translationOf,
          language: this.props.location.state.language,
        }),
    });
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.push(getBaseUrl(this.props.pathname));
  }

  form = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (this.props.schemaRequest.loaded) {
      const visual = hasBlocksData(this.props.schema.properties);
      const blocksFieldname = getBlocksFieldname(this.props.schema.properties);
      const blocksLayoutFieldname = getBlocksLayoutFieldname(
        this.props.schema.properties,
      );
      const translationObject = this.props.location?.state?.translationObject;

      const translateTo = translationObject
        ? langmap?.[this.props.location?.state?.language]?.nativeName
        : null;

      // Lookup initialBlocks and initialBlocksLayout within schema
      const schemaBlocks = this.props.schema.properties[blocksFieldname]
        ?.default;
      const schemaBlocksLayout = this.props.schema.properties[
        blocksLayoutFieldname
      ]?.default?.items;
      let initialBlocks = this.initialBlocks;
      let initialBlocksLayout = this.initialBlocksLayout;

      if (!isEmpty(schemaBlocksLayout) && !isEmpty(schemaBlocks)) {
        initialBlocks = {};
        initialBlocksLayout = [];
        schemaBlocksLayout.forEach((value) => {
          if (!isEmpty(schemaBlocks[value])) {
            let newUid = uuid();
            initialBlocksLayout.push(newUid);
            initialBlocks[newUid] = schemaBlocks[value];
            initialBlocks[newUid].block = newUid;

            // Layout ID - keep a reference to the original block id within layout
            initialBlocks[newUid]['@layout'] = value;
          }
        });
      }
      //copy blocks from translationObject
      if (translationObject && blocksFieldname && blocksLayoutFieldname) {
        initialBlocks = {};
        initialBlocksLayout = [];
        const originalBlocks = JSON.parse(
          JSON.stringify(translationObject[blocksFieldname]),
        );
        const originalBlocksLayout =
          translationObject[blocksLayoutFieldname].items;

        originalBlocksLayout.forEach((value) => {
          if (!isEmpty(originalBlocks[value])) {
            let newUid = uuid();
            initialBlocksLayout.push(newUid);
            initialBlocks[newUid] = originalBlocks[value];
            initialBlocks[newUid].block = newUid;

            // Layout ID - keep a reference to the original block id within layout
            initialBlocks[newUid]['@canonical'] = value;
          }
        });
      }

      const pageAdd = (
        <div id="page-add">
          <Helmet
            title={this.props.intl.formatMessage(messages.add, {
              type: this.props.type,
            })}
          />
          <Form
            ref={this.form}
            key="translated-or-new-content-form"
            schema={this.props.schema}
            formData={{
              ...(blocksFieldname && {
                [blocksFieldname]:
                  initialBlocks ||
                  this.props.schema.properties[blocksFieldname]?.default,
              }),
              ...(blocksLayoutFieldname && {
                [blocksLayoutFieldname]: {
                  items:
                    initialBlocksLayout ||
                    this.props.schema.properties[blocksLayoutFieldname]?.default
                      ?.items,
                },
              }),
            }}
            requestError={this.state.error}
            onSubmit={this.onSubmit}
            hideActions
            pathname={this.props.pathname}
            visual={visual}
            title={
              this.props?.schema?.title
                ? this.props.intl.formatMessage(messages.add, {
                    type: this.props.schema.title,
                  })
                : null
            }
            loading={this.props.createRequest.loading}
            isFormSelected={this.state.formSelected === 'addForm'}
            onSelectForm={() => {
              this.setState({ formSelected: 'addForm' });
            }}
          />
          {this.state.isClient && (
            <Portal node={document.getElementById('toolbar')}>
              <Toolbar
                pathname={this.props.pathname}
                hideDefaultViewButtons
                inner={
                  <>
                    <Button
                      id="toolbar-save"
                      className="save"
                      aria-label={this.props.intl.formatMessage(messages.save)}
                      onClick={() => this.form.current.onSubmit()}
                      loading={this.props.createRequest.loading}
                    >
                      <Icon
                        name={saveSVG}
                        className="circled"
                        size="30px"
                        title={this.props.intl.formatMessage(messages.save)}
                      />
                    </Button>
                    <Button className="cancel" onClick={() => this.onCancel()}>
                      <Icon
                        name={clearSVG}
                        className="circled"
                        aria-label={this.props.intl.formatMessage(
                          messages.cancel,
                        )}
                        size="30px"
                        title={this.props.intl.formatMessage(messages.cancel)}
                      />
                    </Button>
                  </>
                }
              />
            </Portal>
          )}
          {visual && this.state.isClient && (
            <Portal node={document.getElementById('sidebar')}>
              <Sidebar />
            </Portal>
          )}
        </div>
      );

      return translationObject ? (
        <Grid
          celled="internally"
          stackable
          columns={2}
          id="page-add-translation"
        >
          <Grid.Column className="source-object">
            <TranslationObject
              translationObject={translationObject}
              schema={this.props.schema}
              pathname={this.props.pathname}
              visual={visual}
              isFormSelected={
                this.state.formSelected === 'translationObjectForm'
              }
              onSelectForm={() => {
                this.setState({
                  formSelected: 'translationObjectForm',
                });
              }}
            />
          </Grid.Column>
          <Grid.Column>
            <div className="new-translation">
              <Menu pointing secondary attached tabular>
                <Menu.Item name={translateTo.toUpperCase()} active={true}>
                  {`${this.props.intl.formatMessage(messages.translateTo, {
                    lang: translateTo,
                  })}`}
                </Menu.Item>
              </Menu>
              {pageAdd}
            </div>
          </Grid.Column>
        </Grid>
      ) : (
        pageAdd
      );
    }
    return <div />;
  }
}

export default compose(
  DragDropContext(HTML5Backend),
  injectIntl,
  connect(
    (state, props) => ({
      createRequest: state.content.create,
      schemaRequest: state.schema,
      content: state.content.data,
      schema: state.schema.schema,
      pathname: props.location.pathname,
      returnUrl: qs.parse(props.location.search).return_url,
      type: qs.parse(props.location.search).type,
    }),
    { createContent, getSchema },
  ),
  preloadLazyLibs('cms'),
)(Add);
