/**
 * Personal information component.
 * @module components/manage/Preferences/PersonalInformation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { defineMessages, injectIntl } from 'react-intl';
import jwtDecode from 'jwt-decode';

import { Form, Toast, toast } from '@plone/volto/components';
import { getUser, updateUser } from '@plone/volto/actions';

const messages = defineMessages({
  personalInformation: {
    id: 'Personal Information',
    defaultMessage: 'Personal Information',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  fullnameTitle: {
    id: 'Full Name',
    defaultMessage: 'Full Name',
  },
  fullnameDescription: {
    id: 'Enter full name, e.g. John Smith.',
    defaultMessage: 'Enter full name, e.g. John Smith.',
  },
  emailTitle: {
    id: 'E-mail',
    defaultMessage: 'E-mail',
  },
  emailDescription: {
    id: 'We will use this address if you need to recover your password',
    defaultMessage:
      'We will use this address if you need to recover your password',
  },
  portraitTitle: {
    id: 'Portrait',
    defaultMessage: 'Portrait',
  },
  portraitDescription: {
    id: 'The user portrait/avatar',
    defaultMessage: 'The user portrait/avatar',
  },
  homePageTitle: {
    id: 'Home page',
    defaultMessage: 'Home page',
  },
  homePageDescription: {
    id: 'The URL for your external home page, if you have one.',
    defaultMessage: 'The URL for your external home page, if you have one.',
  },
  locationTitle: {
    id: 'Location',
    defaultMessage: 'Location',
  },
  locationDescription: {
    id:
      'Your location - either city and country - or in a company setting, where your office is located.',
    defaultMessage:
      'Your location - either city and country - or in a company setting, where your office is located.',
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
 * PersonalInformation class.
 * @class PersonalInformation
 * @extends Component
 */
class PersonalInformation extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    user: PropTypes.shape({
      fullname: PropTypes.string,
      email: PropTypes.string,
      home_page: PropTypes.string,
      location: PropTypes.string,
    }).isRequired,
    updateUser: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
    userId: PropTypes.string.isRequired,
    loaded: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    closeMenu: PropTypes.func.isRequired,
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
  }

  componentDidMount() {
    this.props.getUser(this.props.userId);
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
    // We don't want the user to change his login name/username or the roles
    // from this form
    // Backend will complain anyways, but we clean the data here before it does
    delete data.id;
    delete data.username;
    delete data.roles;
    this.props.updateUser(this.props.userId, data);
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.saved)}
      />,
    );
    this.props.closeMenu();
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.closeMenu();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Form
        formData={this.props.user}
        schema={{
          fieldsets: [
            {
              id: 'default',
              title: this.props.intl.formatMessage(messages.default),
              fields: [
                'fullname',
                'email',
                'portrait',
                'home_page',
                'location',
              ],
            },
          ],
          properties: {
            fullname: {
              description: this.props.intl.formatMessage(
                messages.fullnameDescription,
              ),
              title: this.props.intl.formatMessage(messages.fullnameTitle),
              type: 'string',
            },
            email: {
              description: this.props.intl.formatMessage(
                messages.emailDescription,
              ),
              title: this.props.intl.formatMessage(messages.emailTitle),
              type: 'string',
            },
            portrait: {
              description: this.props.intl.formatMessage(
                messages.portraitDescription,
              ),
              title: this.props.intl.formatMessage(messages.portraitTitle),
              type: 'object',
            },
            home_page: {
              description: this.props.intl.formatMessage(
                messages.homePageDescription,
              ),
              title: this.props.intl.formatMessage(messages.homePageTitle),
              type: 'string',
            },
            location: {
              description: this.props.intl.formatMessage(
                messages.locationDescription,
              ),
              title: this.props.intl.formatMessage(messages.locationTitle),
              type: 'string',
            },
          },
          required: ['email'],
        }}
        onSubmit={this.onSubmit}
        onCancel={this.onCancel}
        loading={this.props.loading}
      />
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      user: state.users.user,
      userId: state.userSession.token
        ? jwtDecode(state.userSession.token).sub
        : '',
      loaded: state.users.get.loaded,
      loading: state.users.update.loading,
    }),
    { getUser, updateUser },
  ),
)(PersonalInformation);
