/**
 * Content Type component.
 * @module components/manage/Controlpanels/ContentTypeLayout
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  getParentUrl,
  hasBlocksData,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import { Button, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { nth, join } from 'lodash';
import {
  Error,
  Form,
  Icon,
  Toolbar,
  Sidebar,
  Toast,
  toast,
} from '@plone/volto/components';
import {
  getSchema,
  updateSchema,
  getControlpanel,
  updateControlpanel,
} from '@plone/volto/actions';

import saveSVG from '@plone/volto/icons/save.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  changesSaved: {
    id: 'Changes saved.',
    defaultMessage: 'Changes saved.',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  info: {
    id: 'Info',
    defaultMessage: 'Info',
  },
  enable: {
    id: 'Enable editable Blocks',
    defaultMessage: 'Enable editable Blocks',
  },
});

/**
 * ContentTypeLayout class.
 * @class ContentTypeLayout
 * @extends Component
 */
class ContentTypeLayout extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    updateControlpanel: PropTypes.func.isRequired,
    getControlpanel: PropTypes.func.isRequired,
    getSchema: PropTypes.func.isRequired,
    updateSchema: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
    schemaRequest: PropTypes.objectOf(PropTypes.any).isRequired,
    cpanelRequest: PropTypes.objectOf(PropTypes.any).isRequired,
    schema: PropTypes.objectOf(PropTypes.any),
    controlpanel: PropTypes.shape({
      '@id': PropTypes.string,
      data: PropTypes.object,
      schema: PropTypes.object,
      title: PropTypes.string,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    schema: {},
    controlpanel: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ContentTypeLayout
   */
  constructor(props) {
    super(props);

    this.state = {
      visual: false,
      content: null,
      readOnlyBehavior: null,
      error: null,
      isClient: false,
    };

    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onEnableBlocks = this.onEnableBlocks.bind(this);
    this.onDisableBlocksBehavior = this.onDisableBlocksBehavior.bind(this);
    this.form = React.createRef();
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getControlpanel(join([this.props.parent, this.props.id], '/'));
    this.props.getSchema(this.props.id);
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Control Panel GET
    if (
      this.props.cpanelRequest.get.loading &&
      nextProps.cpanelRequest.get.error
    ) {
      this.setState({
        error: nextProps.cpanelRequest.get.error,
      });
    }

    // Schema GET
    if (this.props.schemaRequest.loading && nextProps.schemaRequest.loaded) {
      let properties = nextProps.schema?.properties || {};
      let content = {};
      let value, key;
      for (key in properties) {
        value = properties[key].default;
        if (value) {
          content[key] = value;
        }
      }

      if (hasBlocksData(properties)) {
        this.setState({
          visual: true,
        });

        const blocksFieldName = getBlocksFieldname(properties);
        const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);
        content[blocksFieldName] = properties[blocksFieldName]?.default || {};
        content[blocksLayoutFieldname] = properties[blocksLayoutFieldname]
          ?.default || { items: [] };

        const blocksBehavior = properties[blocksFieldName]?.behavior || '';
        this.setState({
          readOnlyBehavior: !blocksBehavior.includes('generated')
            ? blocksBehavior
            : '',
        });
      } else {
        this.setState({
          visual: false,
          readOnlyBehavior: '',
        });
      }

      this.setState({
        content: content,
      });
    }

    // Schema updated
    if (
      this.props.schemaRequest.update.loading &&
      nextProps.schemaRequest.update.loaded
    ) {
      this.props.getSchema(this.props.id);
      toast.info(
        <Toast
          info
          title={this.props.intl.formatMessage(messages.info)}
          content={this.props.intl.formatMessage(messages.changesSaved)}
        />,
      );
    }

    // Blocks behavior disabled
    if (
      this.props.cpanelRequest.update.loading &&
      nextProps.cpanelRequest.update.loaded
    ) {
      this.onEnableBlocks();
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
    let schema = { properties: {} };
    Object.keys(data)
      .filter((k) => data[k])
      .forEach((k) => (schema.properties[k] = { default: data[k] }));
    this.props.updateSchema(this.props.id, schema);
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    let url = getParentUrl(this.props.pathname);
    this.props.history.push(getParentUrl(url));
  }

  /**
   * Enable blocks handler
   * @method onEnableBlocks
   * @returns {undefined}
   */
  onEnableBlocks() {
    let schema = {
      fieldsets: [
        {
          id: 'layout',
          title: 'Layout',
          fields: ['blocks', 'blocks_layout'],
        },
      ],
      properties: {
        blocks: {
          title: 'Blocks',
          type: 'dict',
          widget: 'json',
          factory: 'JSONField',
        },
        blocks_layout: {
          title: 'Blocks Layout',
          type: 'dict',
          widget: 'json',
          factory: 'JSONField',
        },
      },
    };
    this.props.updateSchema(this.props.id, schema);
  }

  /**
   * Disable Blocks behavior handler
   * @method onDisableBlocksBehavior
   * @returns {undefined}
   */
  onDisableBlocksBehavior() {
    this.props.updateControlpanel(this.props.controlpanel['@id'], {
      [this.state.readOnlyBehavior]: false,
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    // Error
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }

    if (!this.state.visual) {
      // Still loading
      if (!this.state.content) {
        return <div />;
      }

      // Blocks are not enabled
      return (
        <>
          <Segment
            placeholder
            id="page-controlpanel-layout"
            className="ui container center aligned"
          >
            <div>
              <FormattedMessage
                id="Can not edit Layout for <strong>{type}</strong> content-type as it doesn't have support for <strong>Volto Blocks</strong> enabled"
                defaultMessage="Can not edit Layout for <strong>{type}</strong> content-type as it doesn't have support for <strong>Volto Blocks</strong> enabled"
                values={{
                  strong: (...chunks) => <strong>{chunks}</strong>,
                  type: this.props?.controlpanel?.title || this.props.id,
                }}
              />
            </div>
            <div className="ui divider"></div>
            <Button
              primary
              onClick={this.onEnableBlocks}
              content={this.props.intl.formatMessage(messages.enable)}
            />
          </Segment>
          <Portal
            node={this.state.isClient && document.getElementById('toolbar')}
          >
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <>
                  <Link className="item" to="#" onClick={() => this.onCancel()}>
                    <Icon
                      name={backSVG}
                      size="30px"
                      className="contents circled"
                      title={this.props.intl.formatMessage(messages.back)}
                    />
                  </Link>
                </>
              }
            />
          </Portal>
        </>
      );
    }

    if (this.state.readOnlyBehavior) {
      return (
        <>
          <Segment
            placeholder
            id="page-controlpanel-layout"
            className="ui container center aligned"
          >
            <div>
              <FormattedMessage
                id="Can not edit Layout for <strong>{type}</strong> content-type as the <strong>Blocks behavior</strong> is enabled and <strong>read-only</strong>"
                defaultMessage="Can not edit Layout for <strong>{type}</strong> content-type as the <strong>Blocks behavior</strong> is enabled and <strong>read-only</strong>"
                values={{
                  strong: (...chunks) => <strong>{chunks}</strong>,
                  type: this.props?.controlpanel?.title || this.props.id,
                }}
              />
            </div>
            <div className="ui divider"></div>
            <Button
              primary
              onClick={this.onDisableBlocksBehavior}
              content={this.props.intl.formatMessage(messages.enable)}
            />
          </Segment>
          <Portal
            node={this.state.isClient && document.getElementById('toolbar')}
          >
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <>
                  <Link className="item" to="#" onClick={() => this.onCancel()}>
                    <Icon
                      name={backSVG}
                      size="30px"
                      className="contents circled"
                      title={this.props.intl.formatMessage(messages.back)}
                    />
                  </Link>
                </>
              }
            />
          </Portal>
        </>
      );
    }

    // Render layout editor
    const blocksFieldName = getBlocksFieldname(
      this.props.schema?.properties || {},
    );
    const blocksLayoutFieldname = getBlocksLayoutFieldname(
      this.props.schema?.properties || {},
    );
    return (
      <div id="page-controlpanel-layout">
        <Form
          isAdminForm
          ref={this.form}
          schema={{
            fieldsets: [
              {
                id: 'layout',
                title: 'Layout',
                fields: [blocksFieldName, blocksLayoutFieldname],
              },
            ],
            properties: {
              ...this.props.schema.properties[blocksFieldName],
              ...this.props.schema.properties[blocksLayoutFieldname],
            },
            required: [],
          }}
          formData={this.state.content}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          pathname={this.props.pathname}
          visual={this.state.visual}
          hideActions
        />
        <Portal
          node={this.state.isClient && document.getElementById('sidebar')}
        >
          <Sidebar settingsTab={true} documentTab={false} />
        </Portal>
        <Portal
          node={this.state.isClient && document.getElementById('toolbar')}
        >
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
                  disabled={this.props.schemaRequest.update.loading}
                  loading={this.props.schemaRequest.update.loading}
                >
                  <Icon
                    name={saveSVG}
                    className="circled"
                    size="30px"
                    title={this.props.intl.formatMessage(messages.save)}
                  />
                </Button>
                <Button
                  className="cancel"
                  aria-label={this.props.intl.formatMessage(messages.cancel)}
                  onClick={() => this.onCancel()}
                >
                  <Icon
                    name={clearSVG}
                    className="circled"
                    size="30px"
                    title={this.props.intl.formatMessage(messages.cancel)}
                  />
                </Button>
              </>
            }
          />
        </Portal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      schema: state.schema.schema,
      schemaRequest: state.schema,
      cpanelRequest: state.controlpanels,
      controlpanel: state.controlpanels.controlpanel,
      pathname: props.location.pathname,
      id: nth(props.location.pathname.split('/'), -2),
      parent: nth(props.location.pathname.split('/'), -3),
    }),
    { getSchema, updateSchema, getControlpanel, updateControlpanel },
  ),
)(ContentTypeLayout);
