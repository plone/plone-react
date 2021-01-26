/**
 * Edit description block.
 * @module components/manage/Blocks/Description/Edit
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';
import cx from 'classnames';
import { settings } from '~/config';

import loadable from '@loadable/component';
const LibDraftJs = loadable.lib(() => import('draft-js'));
const LibDraftJsImportHtml = loadable.lib(() => import('draft-js-import-html'));

const blockRenderMap = Map({
  unstyled: {
    element: 'div',
  },
});

const messages = defineMessages({
  description: {
    id: 'Add a description…',
    defaultMessage: 'Add a description…',
  },
});

/**
 * Edit description block class.
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
    properties: PropTypes.objectOf(PropTypes.any).isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
  };

  state = { editorState: null, focus: false };

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.node) {
      this.node._onBlur = () => this.setState({ focus: false });
      this.node._onFocus = () => this.setState({ focus: true });
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.properties.description &&
      this.props.properties.description !== nextProps.properties.description &&
      !this.state.focus
    ) {
      const contentState = this.libDraftJsImportHtmlRef.current.stateFromHTML(
        nextProps.properties.description,
      );
      this.setState({
        editorState: nextProps.properties.description
          ? this.libDraftJsRef.current.EditorState.createWithContent(
              contentState,
            )
          : this.libDraftJsRef.current.EditorState.createEmpty(),
      });
    }

    if (!this.props.selected && nextProps.selected) {
      this.node.focus();
      this.setState({ focus: true });
    }
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange = (editorState) => {
    this.setState({ editorState }, () => {
      this.props.onChangeField(
        'description',
        editorState.getCurrentContent().getPlainText(),
      );
    });
  };

  extendedBlockRenderMap = null;

  checkLibs = () => {
    if (!this.libDraftJsRef.current || !this.libDraftJsImportHtmlRef.current) {
      return;
    }

    this.extendedBlockRenderMap = this.libDraftJsRef.current.DefaultDraftBlockRenderMap.merge(
      blockRenderMap,
    );

    this.Editor = this.libDraftJsRef.current.Editor;

    let editorState;
    if (this.props.properties && this.props.properties.description) {
      const contentState = this.libDraftJsImportHtmlRef.current.stateFromHTML(
        this.props.properties.description,
      );
      editorState = this.libDraftJsRef.current.EditorState.createWithContent(
        contentState,
      );
    } else {
      editorState = this.libDraftJsRef.current.EditorState.createEmpty();
    }
    this.setState({ editorState });
  };

  libDraftJsImportHtmlRef = React.createRef();
  libDraftJsRef = React.createRef();

  libDraftJsLoaded = (lib) => {
    this.libDraftJsRef.current = lib;
    this.checkLibs();
  };

  libDraftJsImportHtmlLoaded = (lib) => {
    this.libDraftJsImportHtmlRef.current = lib;
    this.checkLibs();
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    return (
      <div
        className={cx('block description', { selected: this.props.selected })}
      >
        <LibDraftJsImportHtml ref={this.libDraftJsImportHtmlLoaded} />
        <LibDraftJs ref={this.libDraftJsLoaded} />
        {!!this.state.editorState && (
          <this.Editor
            onChange={this.onChange}
            editorState={this.state.editorState}
            blockRenderMap={this.extendedBlockRenderMap}
            handleReturn={() => {
              if (this.props.data?.disableNewBlocks) {
                return 'handled';
              }
              this.props.onSelectBlock(
                this.props.onAddBlock(
                  settings.defaultBlockType,
                  this.props.index + 1,
                ),
              );
              return 'handled';
            }}
            handleKeyCommand={(command, editorState) => {
              if (
                command === 'backspace' &&
                editorState.getCurrentContent().getPlainText().length === 0
              ) {
                this.props.onDeleteBlock(this.props.block, true);
              }
            }}
            placeholder={this.props.intl.formatMessage(messages.description)}
            blockStyleFn={() => 'documentDescription'}
            onUpArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const { editorState } = this.state;
              if (
                editorState
                  .getCurrentContent()
                  .getBlockMap()
                  .first()
                  .getKey() === selectionState.getFocusKey()
              ) {
                this.props.onFocusPreviousBlock(this.props.block, this.node);
              }
            }}
            onDownArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const { editorState } = this.state;
              if (
                editorState
                  .getCurrentContent()
                  .getBlockMap()
                  .last()
                  .getKey() === selectionState.getFocusKey()
              ) {
                this.props.onFocusNextBlock(this.props.block, this.node);
              }
            }}
            ref={(node) => {
              this.node = node;
            }}
          />
        )}
      </div>
    );
  }
}

export default injectIntl(Edit);
