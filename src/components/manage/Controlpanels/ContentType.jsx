/**
 * Content Type component.
 * @module components/manage/Controlpanels/ContentType
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getParentUrl } from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import { Button, Header } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { last, nth, join } from 'lodash';
import {
  Error,
  Form,
  Icon,
  Toolbar,
  Toast,
  toast,
} from '@plone/volto/components';
import { getControlpanel, updateControlpanel } from '@plone/volto/actions';

import saveSVG from '@plone/volto/icons/save.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

const messages = defineMessages({
  title: {
    id: '{id} Content Type',
    defaultMessage: '{id} Content Type',
  },
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
});

/**
 * ContentType class.
 * @class ContentType
 * @extends Component
 */
class ContentType extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    updateControlpanel: PropTypes.func.isRequired,
    getControlpanel: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    parent: PropTypes.string.isRequired,
    cpanelRequest: PropTypes.objectOf(PropTypes.any).isRequired,
    controlpanel: PropTypes.shape({
      '@id': PropTypes.string,
      data: PropTypes.object,
      schema: PropTypes.object,
      title: PropTypes.string,
    }),
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    controlpanel: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ContentType
   */
  constructor(props) {
    super(props);

    this.state = {
      visual: false,
      error: null,
      isClient: false,
    };

    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.form = React.createRef();
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getControlpanel(join([this.props.parent, this.props.id], '/'));
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

    // Control Panel PATCH
    if (
      this.props.cpanelRequest.update.loading &&
      nextProps.cpanelRequest.update.loaded
    ) {
      toast.info(
        <Toast
          info
          title={this.props.intl.formatMessage(messages.info)}
          content={this.props.intl.formatMessage(messages.changesSaved)}
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
    this.props.updateControlpanel(this.props.controlpanel['@id'], data);
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.push(getParentUrl(this.props.pathname));
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

    if (this.props.controlpanel) {
      let controlpanel = this.props.controlpanel;
      if (controlpanel?.data?.filter_content_types === false) {
        controlpanel.data.filter_content_types = { title: 'all', token: 'all' };
      }
      if (controlpanel?.data?.filter_content_types === true) {
        if ((controlpanel?.data?.allowed_content_types || []).length) {
          controlpanel.data.filter_content_types = {
            title: 'some',
            token: 'some',
          };
        } else {
          controlpanel.data.filter_content_types = {
            title: 'none',
            token: 'none',
          };
        }
      }
      return (
        <div id="page-controlpanel" className="ui container">
          <Header disabled>
            {this.props.intl.formatMessage(messages.title, {
              id: controlpanel.title,
            })}
          </Header>
          <Form
            isEditForm
            ref={this.form}
            schema={controlpanel.schema}
            formData={controlpanel.data}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
            pathname={this.props.pathname}
            visual={this.state.visual}
            hideActions
            loading={this.props.cpanelRequest.update.loading}
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
                      disabled={this.props.cpanelRequest.update.loading}
                      loading={this.props.cpanelRequest.update.loading}
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
                      aria-label={this.props.intl.formatMessage(
                        messages.cancel,
                      )}
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
          )}
        </div>
      );
    }
    return <div />;
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      controlpanel: state.controlpanels.controlpanel,
      cpanelRequest: state.controlpanels,
      pathname: props.location.pathname,
      id: last(props.location.pathname.split('/')),
      parent: nth(props.location.pathname.split('/'), -2),
    }),
    { getControlpanel, updateControlpanel },
  ),
)(ContentType);
