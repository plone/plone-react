/**
 * Edit block.
 * @module components/manage/Blocks/Block/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { setSidebarTab } from '@plone/volto/actions';
import config from '@plone/volto/registry';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';

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
});

/**
 * Edit block class.
 * @class Edit
 * @extends Component
 */
export class Edit extends Component {
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
    multiSelected: PropTypes.bool,
    index: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    manage: PropTypes.bool,
    onMoveBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    editable: PropTypes.bool,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    manage: false,
    editable: true,
  };

  componentDidMount() {
    const { type } = this.props;
    const { blocksConfig = config.blocks.blocksConfig } = this.props;

    const blockHasOwnFocusManagement =
      blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;
    if (
      !blockHasOwnFocusManagement &&
      this.props.selected &&
      this.blockNode.current
    ) {
      this.blockNode.current.focus();
    }
    const tab = this.props.manage ? 1 : blocksConfig?.[type]?.sidebarTab || 0;
    if (this.props.selected && this.props.editable) {
      this.props.setSidebarTab(tab);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { blocksConfig = config.blocks.blocksConfig } = this.props;
    const { selected, type } = this.props;
    const blockHasOwnFocusManagement =
      blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;
    if (
      !blockHasOwnFocusManagement &&
      nextProps.selected &&
      selected !== nextProps.selected &&
      this.blockNode.current
    ) {
      this.blockNode.current.focus();
    }
    if (
      ((!this.props.selected && nextProps.selected) ||
        type !== nextProps.type) &&
      this.props.editable
    ) {
      const tab = this.props.manage
        ? 1
        : blocksConfig?.[nextProps.type]?.sidebarTab || 0;
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
    const { blocksConfig = config.blocks.blocksConfig } = this.props;
    const { editable, type } = this.props;

    const disableNewBlocks = this.props.data?.disableNewBlocks;

    let Block = blocksConfig?.[type]?.['edit'] || null;
    if (
      this.props.data?.readOnly ||
      (!editable && !config.blocks.showEditBlocksInBabelView)
    ) {
      Block = blocksConfig?.[type]?.['view'] || null;
    }
    const schema = blocksConfig?.[type]?.['schema'] || BlockSettingsSchema;
    const blockHasOwnFocusManagement =
      blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;

    return (
      <>
        {Block !== null ? (
          <div
            role="presentation"
            onClick={(e) => {
              const isMultipleSelection = e.shiftKey || e.ctrlKey || e.metaKey;
              // !this.props.selected &&
              this.props.onSelectBlock(
                this.props.id,
                isMultipleSelection,
                // this.props.selected ? false : isMultipleSelection,
                e,
              );
            }}
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
            className={cx(`block ${type}`, {
              selected: this.props.selected || this.props.multiSelected,
              multiSelected: this.props.multiSelected,
            })}
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
            onClick={() =>
              !this.props.selected && this.props.onSelectBlock(this.props.id)
            }
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
      </>
    );
  }
}

export default compose(
  injectIntl,
  withObjectBrowser,
  connect(null, { setSidebarTab }),
)(Edit);
