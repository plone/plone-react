/**
 * Toolbar component.
 * @module components/manage/Toolbar/Toolbar
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Dropdown, Icon, Menu } from 'semantic-ui-react';
import jwtDecode from 'jwt-decode';
import cookie from 'react-cookie';
import {
  FormattedMessage,
  defineMessages,
  injectIntl,
  intlShape,
} from 'react-intl';

import { Actions, Display, Types, Workflow } from '../../../components';

import logo from './plone-toolbarlogo.svg';

const messages = defineMessages({
  ploneToolbar: {
    id: 'Plone Toolbar',
    defaultMessage: 'Plone Toolbar',
  },
});

/**
 * Toolbar container class.
 * @class Toolbar
 * @extends Component
 */
@injectIntl
@connect(state => ({
  token: state.userSession.token,
  fullname: state.userSession.token
    ? jwtDecode(state.userSession.token).fullname
    : '',
  content: state.content.data,
}))
export default class Toolbar extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    selected: PropTypes.string.isRequired,
    token: PropTypes.string,
    fullname: PropTypes.string,
    content: PropTypes.shape({
      '@type': PropTypes.string,
    }),
    intl: intlShape.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
    fullname: '',
    content: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Toolbar
   */
  constructor(props) {
    super(props);
    this.onToggleExpanded = this.onToggleExpanded.bind(this);
    this.state = {
      expanded: cookie.load('toolbar_expanded') !== 'false',
    };
  }

  /**
   * On toggle expanded handler
   * @method onToggleExpanded
   * 
   */
  onToggleExpanded() {
    cookie.save('toolbar_expanded', !this.state.expanded, {
      expires: new Date((2 ** 31 - 1) * 1000),
      path: '/',
    });
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const expanded = this.state.expanded;

    // Needs to be replaced with is_folderish on the content when available
    // in the API.
    const isFolderish =
      ['Folder', 'Plone Site'].indexOf(this.props.content['@type']) !== -1;
    return (
      this.props.token && (
        <Menu
          inverted
          vertical
          fixed="left"
          className={!expanded ? 'collapsed' : ''}
        >
          <Menu.Item color="blue" active onClick={this.onToggleExpanded}>
            <img
              alt={this.props.intl.formatMessage(messages.ploneToolbar)}
              src={logo}
            />
          </Menu.Item>
          {isFolderish && (
            <Link
              to={`${this.props.pathname}/contents`}
              className={`item${this.props.selected === 'contents'
                ? ' active'
                : ''}`}
            >
              <span>
                <Icon name="folder open" />{' '}
                {expanded && (
                  <FormattedMessage id="Contents" defaultMessage="Contents" />
                )}
              </span>
            </Link>
          )}
          <Link
            to={`${this.props.pathname}/edit`}
            className={`item${this.props.selected === 'edit' ? ' active' : ''}`}
          >
            <span>
              <Icon name="write" />{' '}
              {expanded && <FormattedMessage id="Edit" defaultMessage="Edit" />}
            </span>
          </Link>
          <Link
            to={this.props.pathname}
            className={`item${this.props.selected === 'view' ? ' active' : ''}`}
          >
            <span>
              <Icon name="eye" />{' '}
              {expanded && <FormattedMessage id="View" defaultMessage="View" />}
            </span>
          </Link>
          {isFolderish && (
            <Types
              pathname={this.props.pathname}
              active={this.props.selected === 'add'}
              expanded={expanded}
            />
          )}
          <Workflow pathname={this.props.pathname} expanded={expanded} />
          <Actions pathname={this.props.pathname} expanded={expanded} />
          <Display pathname={this.props.pathname} expanded={expanded} />
          <Link
            to={`${this.props.pathname}/history`}
            className={`item${this.props.selected === 'history'
              ? ' active'
              : ''}`}
          >
            <span>
              <Icon name="clock" />{' '}
              {expanded && (
                <FormattedMessage id="History" defaultMessage="History" />
              )}
            </span>
          </Link>
          <Link
            to={`${this.props.pathname}/sharing`}
            className={`item${this.props.selected === 'sharing'
              ? ' active'
              : ''}`}
          >
            <span>
              <Icon name="users" />{' '}
              {expanded && (
                <FormattedMessage id="Sharing" defaultMessage="Sharing" />
              )}
            </span>
          </Link>
          <Dropdown
            className="personal-bar"
            item
            upward
            trigger={
              <span>
                <Icon name="user" />
                {expanded && ` ${this.props.fullname}`}
              </span>
            }
            pointing="left"
          >
            <Dropdown.Menu>
              <Link to="/personal-preferences" className="item">
                <span>
                  <Icon name="setting" />{' '}
                  <FormattedMessage
                    id="Preferences"
                    defaultMessage="Preferences"
                  />
                </span>
              </Link>
              <Link to="/logout" className="item">
                <span>
                  <Icon name="sign out" />{' '}
                  <FormattedMessage id="Log out" defaultMessage="Log out" />
                </span>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
      )
    );
  }
}
