/**
 * Change password component.
 * @module components/manage/Preferences/ChangePassword
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { Portal } from 'react-portal';
import { defineMessages, injectIntl } from 'react-intl';
import { Container } from 'semantic-ui-react';
import { toast } from 'react-toastify';

import { Form, Icon, Toast, Toolbar } from '@plone/volto/components';
import { updatePassword } from '@plone/volto/actions';
import { userData } from '@plone/volto/selectors/userSession/userSession';
import { getBaseUrl } from '@plone/volto/helpers';

import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  changePassword: {
    id: 'Change Password',
    defaultMessage: 'Change Password',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  oldPasswordTitle: {
    id: 'Current password',
    defaultMessage: 'Current password',
  },
  oldPasswordDescription: {
    id: 'Enter your current password.',
    defaultMessage: 'Enter your current password.',
  },
  newPasswordTitle: {
    id: 'New password',
    defaultMessage: 'New password',
  },
  newPasswordDescription: {
    id: 'Enter your new password. Minimum 5 characters.',
    defaultMessage: 'Enter your new password. Minimum 5 characters.',
  },
  newPasswordRepeatTitle: {
    id: 'Confirm password',
    defaultMessage: 'Confirm password',
  },
  newPasswordRepeatDescription: {
    id: 'Re-enter the password. Make sure the passwords are identical.',
    defaultMessage:
      'Re-enter the password. Make sure the passwords are identical.',
  },
  saved: {
    id: 'Changes saved',
    defaultMessage: 'Changes saved',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
});

/**
 * ChangePassword class.
 * @class ChangePassword
 * @extends Component
 */
class ChangePassword extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    userId: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    updatePassword: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs ChangePassword
   */
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { isClient: false };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.setState({ isClient: true });
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
    if (data.newPassword === data.newPasswordRepeat) {
      this.props.updatePassword(
        this.props.userId,
        data.oldPassword,
        data.newPassword,
      );
      toast.success(
        <Toast
          success
          title={this.props.intl.formatMessage(messages.success)}
          content={this.props.intl.formatMessage(messages.saved)}
        />,
      );
    }
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.goBack();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Container id="page-change-password">
        <Helmet
          title={this.props.intl.formatMessage(messages.changePassword)}
        />
        <Form
          schema={{
            fieldsets: [
              {
                id: 'default',
                title: this.props.intl.formatMessage(messages.default),
                fields: ['oldPassword', 'newPassword', 'newPasswordRepeat'],
              },
            ],
            properties: {
              oldPassword: {
                description: this.props.intl.formatMessage(
                  messages.oldPasswordDescription,
                ),
                title: this.props.intl.formatMessage(messages.oldPasswordTitle),
                type: 'string',
                widget: 'password',
              },
              newPassword: {
                description: this.props.intl.formatMessage(
                  messages.newPasswordDescription,
                ),
                title: this.props.intl.formatMessage(messages.newPasswordTitle),
                type: 'string',
                widget: 'password',
              },
              newPasswordRepeat: {
                description: this.props.intl.formatMessage(
                  messages.newPasswordRepeatDescription,
                ),
                title: this.props.intl.formatMessage(
                  messages.newPasswordRepeatTitle,
                ),
                type: 'string',
                widget: 'password',
              },
            },
            required: ['oldPassword', 'newPassword', 'newPasswordRepeat'],
          }}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          loading={this.props.loading}
        />
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <Link
                  to={`${getBaseUrl(this.props.pathname)}`}
                  className="item"
                >
                  <Icon
                    name={backSVG}
                    className="contents circled"
                    size="30px"
                    title={this.props.intl.formatMessage(messages.back)}
                  />
                </Link>
              }
            />
          </Portal>
        )}
      </Container>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      userId: userData(state).userId,
      loading: state.users.update_password.loading,
      pathname: props.location.pathname,
    }),
    { updatePassword },
  ),
)(ChangePassword);
