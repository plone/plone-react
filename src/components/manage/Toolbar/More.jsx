/**
 * More component.
 * @module components/manage/Toolbar/More
 */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Icon } from '@plone/volto/components';

import userSVG from '@plone/volto/icons/user.svg';

const messages = defineMessages({
  personalTools: {
    id: 'Personal tools',
    defaultMessage: 'Personal tools',
  },
});

/**
 * More container class.
 * @class More
 * @extends Component
 */
class More extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    pathname: PropTypes.string.isRequired,
    content: PropTypes.shape({
      title: PropTypes.string,
      '@type': PropTypes.string,
      is_folderish: PropTypes.bool,
      review_state: PropTypes.string,
    }),
    loadComponent: PropTypes.func.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    content: null,
  };
  state = {
    pushed: false,
  };

  push = (selector) => {
    this.setState(() => ({
      pushed: true,
    }));
    this.props.loadComponent(selector);
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const actionComponents = this.props.extras || [];
    return (
      <div
        className="menu-more pastanaga-menu"
        style={{
          flex: this.props.theToolbar.current
            ? `0 0 ${
                this.props.theToolbar.current.getBoundingClientRect().width
              }px`
            : null,
        }}
      >
        <header>
          <h2>{this.props.content.title}</h2>
          <button
            className="more-user"
            aria-label={this.props.intl.formatMessage(messages.personalTools)}
            onClick={() => this.push('personalTools')}
            tabIndex={0}
          >
            <Icon name={userSVG} size="30px" />
          </button>
        </header>
        <div className="pastanaga-menu-list">
          <ul>
            {actionComponents.map((ActionComponent, index) => (
              <ActionComponent {...this.props} key={index} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      pathname: props.pathname,
      content: state.content.data,
    }),
    {},
  ),
)(More);
