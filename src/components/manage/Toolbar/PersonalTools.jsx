/**
 * PersonalTools container.
 * @module components/manage/Toolbar/PersonalTools
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Icon } from '@plone/volto/components';
import { getUser } from '@plone/volto/actions';
import { userData } from '@plone/volto/selectors/userSession/userSession';
import { userHasRoles } from '@plone/volto/helpers';

import logoutSVG from '@plone/volto/icons/log-out.svg';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';

import backSVG from '@plone/volto/icons/back.svg';
import cameraSVG from '@plone/volto/icons/camera.svg';

const messages = defineMessages({
  preferences: {
    id: 'Preferences',
    defaultMessage: 'Preferences',
  },
  profile: {
    id: 'Profile',
    defaultMessage: 'Profile',
  },
  userAvatar: {
    id: 'user avatar',
    defaultMessage: 'user avatar',
  },
});

/**
 * Toolbar container class.
 * @class PersonalTools
 * @extends Component
 */
class PersonalTools extends Component {
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
    userId: PropTypes.string.isRequired,
    getUser: PropTypes.func.isRequired,
    loadComponent: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getUser(this.props.userId);
  }

  push = (selector) => {
    this.setState(() => ({
      pushed: true,
    }));
    this.props.loadComponent(selector);
  };

  pull = () => {
    this.props.unloadComponent();
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div
        className={cx('personal-tools pastanaga-menu', {
          'has-inner-actions': this.props.hasActions,
        })}
        style={{
          flex: this.props.theToolbar.current
            ? `0 0 ${
                this.props.theToolbar.current.getBoundingClientRect().width
              }px`
            : null,
        }}
      >
        <header className="header">
          <button className="back" onClick={this.pull}>
            <Icon name={backSVG} size="30px" />
          </button>
          <div className="vertical divider" />
          <h2>
            {this.props.user.fullname
              ? this.props.user.fullname
              : this.props.user.username}
          </h2>
          <Link id="toolbar-logout" to="/logout">
            <Icon className="logout" name={logoutSVG} size="30px" />
          </Link>
        </header>
        <div className={cx('avatar', { default: !this.props.user.portrait })}>
          {this.props.user.portrait ? (
            <img
              src={this.props.user.portrait}
              alt={this.props.intl.formatMessage(messages.userAvatar)}
            />
          ) : (
            <Icon name={cameraSVG} size="96px" />
          )}
        </div>
        {/* <Stats /> Maybe we can find a good fit in the future for this visual element */}
        <div className="pastanaga-menu-list">
          {/* This (probably also) should be a Component by itself*/}
          <ul>
            <li>
              <button
                aria-label={this.props.intl.formatMessage(messages.profile)}
                onClick={() => this.push('profile')}
              >
                <FormattedMessage id="Profile" defaultMessage="Profile" />
                <Icon name={rightArrowSVG} size="24px" />
              </button>
            </li>
            <li>
              <button
                aria-label={this.props.intl.formatMessage(messages.preferences)}
                onClick={() => this.push('preferences')}
              >
                <FormattedMessage
                  id="Preferences"
                  defaultMessage="Preferences"
                />
                <Icon name={rightArrowSVG} size="24px" />
              </button>
            </li>

            {userHasRoles(this.props.user, [
              'Site Administrator',
              'Manager',
            ]) && (
              <li>
                <Link to="/controlpanel">
                  <FormattedMessage
                    id="Site Setup"
                    defaultMessage="Site Setup"
                  />
                  <Icon name={rightArrowSVG} size="24px" />
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default injectIntl(
  connect(
    (state) => ({
      user: state.users.user,
      userId: userData(state).userId,
    }),
    { getUser },
  )(PersonalTools),
);
