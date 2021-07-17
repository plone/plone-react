/**
 * Anontools component.
 * @module components/theme/Anontools/Anontools
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import config from '@plone/volto/registry';
import { loggedIn } from '@plone/volto/selectors/userSession/userSession';

/**
 * Anontools container class.
 * @class Anontools
 * @extends Component
 */
export class Anontools extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    userLoggedIn: PropTypes.bool,
    content: PropTypes.shape({
      '@id': PropTypes.string,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    content: {
      '@id': null,
    },
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { settings } = config;
    return (
      !this.props.userLoggedIn && (
        <Menu pointing secondary floated="right">
          <Menu.Item>
            <Link
              aria-label="login"
              to={`/login${
                this.props.content
                  ? `?return_url=${this.props.content['@id'].replace(
                      settings.apiPath,
                      '',
                    )}`
                  : ''
              }`}
            >
              <FormattedMessage id="Log in" defaultMessage="Log in" />
            </Link>
          </Menu.Item>
          {settings.showSelfRegistration && (
            <Menu.Item>
              <Link aria-label="register" to="/register">
                <FormattedMessage id="Register" defaultMessage="Register" />
              </Link>
            </Menu.Item>
          )}
        </Menu>
      )
    );
  }
}

export default connect((state) => ({
  userLoggedIn: loggedIn(state),
  content: state.content.data,
}))(Anontools);
