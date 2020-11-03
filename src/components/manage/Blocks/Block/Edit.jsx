/**
 * Edit block.
 * @module components/manage/Blocks/Block/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import { blocks } from '~/config';
import { Button } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import cx from 'classnames';
import { setSidebarTab } from '@plone/volto/actions';

import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import trashSVG from '@plone/volto/icons/delete.svg';
import {
  SidebarPortal,
  BlockSettingsSidebar,
  BlockSettingsSchema,
} from '@plone/volto/components';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
});

/**
 * Edit block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    // properties is mapped to formData, so it's not connected to changes of the object
    properties: PropTypes.objectOf(PropTypes.any).isRequired,
    selected: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    manage: PropTypes.bool,
    onMoveBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    manage: false,
  };

  componentDidMount() {
    const { type } = this.props;
    const blockHasOwnFocusManagement =
      blocks.blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;
    if (
      !blockHasOwnFocusManagement &&
      this.props.selected &&
      this.blockNode.current
    ) {
      this.blockNode.current.focus();
    }
    const tab = this.props.manage
      ? 1
      : blocks.blocksConfig?.[type]?.sidebarTab || 0;
    if (this.props.selected) {
      this.props.setSidebarTab(tab);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selected, type } = this.props;
    const blockHasOwnFocusManagement =
      blocks.blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;
    if (
      !blockHasOwnFocusManagement &&
      nextProps.selected &&
      selected !== nextProps.selected &&
      this.blockNode.current
    ) {
      this.blockNode.current.focus();
    }
    if (
      (!this.props.selected && nextProps.selected) ||
      type !== nextProps.type
    ) {
      const tab = this.props.manage
        ? 1
        : blocks.blocksConfig?.[nextProps.type]?.sidebarTab || 0;
      this.props.setSidebarTab(tab);
    }
  }

  blockNode = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, type, selected } = this.props;
    const required = isBoolean(this.props.data.required)
      ? this.props.data.required
      : includes(blocks.requiredBlocks, type);

    const disableNewBlocks = this.props.data?.disableNewBlocks;

    let Block = blocks.blocksConfig?.[type]?.['edit'] || null;
    if (this.props.data?.readOnly) {
      Block = blocks.blocksConfig?.[type]?.['view'] || null;
    }
    const schema =
      blocks.blocksConfig?.[type]?.['schema'] || BlockSettingsSchema;
    const blockHasOwnFocusManagement =
      blocks.blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;

    return (
      <div className={`ui drag block inner ${type}`}>
        {Block !== null ? (
          <div
            role="presentation"
            onClick={() => this.props.onSelectBlock(this.props.id)}
            onKeyDown={
              !(blockHasOwnFocusManagement || disableNewBlocks)
                ? (e) =>
                    this.props.handleKeyDown(
                      e,
                      this.props.index,
                      this.props.id,
                      this.blockNode.current,
                    )
                : null
            }
            className={cx(`block ${type}`, { selected: this.props.selected })}
            style={{ outline: 'none' }}
            ref={this.blockNode}
            // The tabIndex is required for the keyboard navigation
            /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
            tabIndex={!blockHasOwnFocusManagement ? -1 : null}
          >
            <Block {...this.props} blockNode={this.blockNode} />
            {this.props.manage && (
              <SidebarPortal
                selected={this.props.selected}
                tab="sidebar-settings"
              >
                <BlockSettingsSidebar {...this.props} schema={schema} />
              </SidebarPortal>
            )}
          </div>
        ) : (
          <div
            role="presentation"
            onClick={() => this.props.onSelectBlock(this.props.id)}
            onKeyDown={
              !(blockHasOwnFocusManagement || disableNewBlocks)
                ? (e) =>
                    this.props.handleKeyDown(
                      e,
                      this.props.index,
                      this.props.id,
                      this.blockNode.current,
                    )
                : null
            }
            className={cx(`block ${type}`, { selected: this.props.selected })}
            style={{ outline: 'none' }}
            ref={this.blockNode}
            // The tabIndex is required for the keyboard navigation
            tabIndex={-1}
          >
            {this.props.intl.formatMessage(messages.unknownBlock, {
              block: type,
            })}
          </div>
        )}
        {selected && !required && (
          <Button
            icon
            basic
            onClick={() => this.props.onDeleteBlock(id, true)}
            className="delete-button"
            aria-label={this.props.intl.formatMessage(messages.delete)}
          >
            <Icon name={trashSVG} size="18px" />
          </Button>
        )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withObjectBrowser,
  connect(null, { setSidebarTab }),
)(Edit);
