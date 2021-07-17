// The difference to the Edit.jsx is that this one strips the "wrapper" things:
// drag handler and delete button. This provides complete control in how the
// wrapper should look like and behave

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { setSidebarTab } from '@plone/volto/actions';
import withObjectBrowser from '@plone/volto/components/manage/Sidebar/ObjectBrowser';
import {
  SidebarPortal,
  BlockSettingsSidebar,
  BlockSettingsSchema,
} from '@plone/volto/components';
import config from '@plone/volto/registry';

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
export class Edit extends React.Component {
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
    const { type, blocksConfig = config.blocks.blocksConfig } = this.props;

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
    if (this.props.selected) {
      this.props.setSidebarTab(tab);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      selected,
      type,
      blocksConfig = config.blocks.blocksConfig,
    } = this.props;
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
      (!this.props.selected && nextProps.selected) ||
      type !== nextProps.type
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
    const {
      type,
      intl,
      blocksConfig = config.blocks.blocksConfig,
    } = this.props;
    const disableNewBlocks = this.props.data?.disableNewBlocks;

    let Block = blocksConfig?.[type]?.['edit'] || null;
    if (this.props.data?.readOnly) {
      Block = blocksConfig?.[type]?.['view'] || null;
    }
    const schema = blocksConfig?.[type]?.['schema'] || BlockSettingsSchema;
    const blockHasOwnFocusManagement =
      blocksConfig?.[type]?.['blockHasOwnFocusManagement'] || null;

    return Block !== null ? (
      <div
        role="presentation"
        onClick={(e) => {
          const isMultipleSelection = e.shiftKey || e.ctrlKey || e.metaKey;
          !this.props.selected &&
            this.props.onSelectBlock(
              this.props.id,
              this.props.selected ? false : isMultipleSelection,
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
          <SidebarPortal selected={this.props.selected} tab="sidebar-settings">
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
        className={cx(`block ${type}`, {
          selected: this.props.selected || this.props.multiSelected,
          multiSelected: this.props.multiSelected,
        })}
        style={{ outline: 'none' }}
        ref={this.blockNode}
        // The tabIndex is required for the keyboard navigation
        tabIndex={-1}
      >
        {intl.formatMessage(messages.unknownBlock, {
          block: type,
        })}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  withObjectBrowser,
  connect(null, { setSidebarTab }),
)(Edit);
