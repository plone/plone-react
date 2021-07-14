/**
 * Actions component.
 * @module components/manage/Actions/Actions
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dropdown, Icon } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { cut, copy, copyContent, moveContent } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';
import { ContentsRenameModal, Toast, toast } from '@plone/volto/components';

const messages = defineMessages({
  cut: {
    id: 'Cut',
    defaultMessage: 'Cut',
  },
  copy: {
    id: 'Copy',
    defaultMessage: 'Copy',
  },
  paste: {
    id: 'Paste',
    defaultMessage: 'Paste',
  },
  rename: {
    id: 'Rename',
    defaultMessage: 'Rename',
  },
  messageCopied: {
    id: '{title} copied.',
    defaultMessage: '{title} copied.',
  },
  messageCut: {
    id: '{title} cut.',
    defaultMessage: '{title} cut.',
  },
  messageDeleted: {
    id: '{title} has been deleted.',
    defaultMessage: '{title} has been deleted.',
  },
  messagePasted: {
    id: 'Item(s) pasted.',
    defaultMessage: 'Item(s) pasted.',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
});

/**
 * Actions container class.
 * @class Actions
 * @extends Component
 */
class Actions extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    pathname: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    action: PropTypes.string,
    source: PropTypes.arrayOf(PropTypes.string),
    cut: PropTypes.func.isRequired,
    copy: PropTypes.func.isRequired,
    copyContent: PropTypes.func.isRequired,
    moveContent: PropTypes.func.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    action: null,
    actions: null,
    source: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Actions
   */
  constructor(props) {
    super(props);
    this.cut = this.cut.bind(this);
    this.copy = this.copy.bind(this);
    this.paste = this.paste.bind(this);
    this.rename = this.rename.bind(this);
    this.onRenameOk = this.onRenameOk.bind(this);
    this.onRenameCancel = this.onRenameCancel.bind(this);
    this.state = {
      showRename: false,
    };
  }

  /**
   * On rename ok
   * @method onRenameOk
   * @returns {undefined}
   */
  onRenameOk() {
    this.setState({
      showRename: false,
    });
  }

  /**
   * On rename cancel
   * @method onRenameCancel
   * @returns {undefined}
   */
  onRenameCancel() {
    this.setState({
      showRename: false,
    });
  }

  /**
   * Cut handler
   * @method cut
   * @returns {undefined}
   */
  cut() {
    this.props.cut([getBaseUrl(this.props.pathname)]);
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.messageCut, {
          title: this.props.title,
        })}
      />,
    );
  }

  /**
   * Copy handler
   * @method copy
   * @returns {undefined}
   */
  copy() {
    this.props.copy([getBaseUrl(this.props.pathname)]);
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.messageCopied, {
          title: this.props.title,
        })}
      />,
    );
  }

  /**
   * Paste handler
   * @method paste
   * @returns {undefined}
   */
  paste() {
    if (this.props.action === 'copy') {
      this.props.copyContent(
        this.props.source,
        getBaseUrl(this.props.pathname),
      );
    }
    if (this.props.action === 'cut') {
      this.props.moveContent(
        this.props.source,
        getBaseUrl(this.props.pathname),
      );
    }
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.messagePasted)}
      />,
    );
  }

  /**
   * Rename handler
   * @method rename
   * @returns {undefined}
   */
  rename() {
    this.setState({
      showRename: true,
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <Dropdown
        item
        id="toolbar-actions"
        trigger={
          <span>
            <Icon name="lightning" size="big" />{' '}
            <FormattedMessage id="Actions" defaultMessage="Actions" />
          </span>
        }
      >
        <Dropdown.Menu>
          {this.props.actions.object_buttons &&
            this.props.actions.object_buttons.map((item) => {
              switch (item.id) {
                case 'cut':
                  return (
                    <Dropdown.Item
                      key={item.id}
                      icon="cut"
                      text={item.title}
                      onClick={this.cut}
                    />
                  );
                case 'copy':
                  return (
                    <Dropdown.Item
                      key={item.id}
                      icon="copy"
                      text={item.title}
                      onClick={this.copy}
                    />
                  );
                case 'paste':
                  return (
                    <Dropdown.Item
                      key={item.id}
                      icon="paste"
                      text={item.title}
                      onClick={this.paste}
                      disabled={this.props.action === null}
                    />
                  );
                case 'delete':
                  return (
                    <Link
                      key={item.id}
                      to={`${this.props.pathname}/delete`}
                      className="item"
                    >
                      <Icon name="trash" />
                      {item.title}
                    </Link>
                  );
                case 'rename':
                  return (
                    <Dropdown.Item
                      key={item.id}
                      icon="text cursor"
                      text={item.title}
                      onClick={this.rename}
                    />
                  );
                default:
                  return null;
              }
            })}

          <ContentsRenameModal
            open={this.state.showRename}
            onCancel={this.onRenameCancel}
            onOk={this.onRenameOk}
            items={[
              {
                url: this.props.pathname,
                title: this.props.title,
                id: this.props.id,
              },
            ]}
          />
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      actions: state.actions.actions,
      action: state.clipboard.action,
      source: state.clipboard.source,
      id: state.content.data ? state.content.data.id : '',
      title: state.content.data ? state.content.data.title : '',
    }),
    {
      cut,
      copy,
      copyContent,
      moveContent,
    },
  ),
)(Actions);
