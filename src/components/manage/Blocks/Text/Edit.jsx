/**
 * Edit text block.
 * @module components/manage/Blocks/Title/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import { defineMessages, injectIntl } from 'react-intl';
import { includes, isEqual } from 'lodash';
import { settings, blocks } from '~/config';

import { Icon, BlockChooser } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/circle-plus.svg';

import loadable from '@loadable/component';
const LibDraftJsPluginsEditor = loadable.lib(() =>
  import('draft-js-plugins-editor'),
);
const LibDraftJs = loadable.lib(() => import('draft-js'));
const LibDraftJsInlineToolbarPlugin = loadable.lib(() =>
  import('draft-js-inline-toolbar-plugin'),
);
const LibDraftJsIsSoftNewlineEvent = loadable.lib(() =>
  import('draft-js/lib/isSoftNewlineEvent'),
);
const LibDraftJsFilters = loadable.lib(() => import('draftjs-filters'));

const messages = defineMessages({
  text: {
    id: 'Type text…',
    defaultMessage: 'Type text…',
  },
});

/**
 * Edit text block class.
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
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    detached: PropTypes.bool,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onMutateBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    allowedBlocks: PropTypes.arrayOf(PropTypes.string),
    showRestricted: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    detached: false,
  };

  state = {};

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !this.props.selected &&
      nextProps.selected &&
      this.libDraftJsRef.current
    ) {
      // See https://github.com/draft-js-plugins/draft-js-plugins/issues/800
      setTimeout(this.node.focus, 0);
      this.setState({
        editorState: this.libDraftJsRef.current.EditorState.moveFocusToEnd(
          this.state.editorState,
        ),
      });
    }
  }

  /**
   * Component will unmount
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange = (editorState) => {
    if (!this.libDraftJsRef.current || !this.libDraftJsFiltersRef.current) {
      return;
    }

    const shouldFilterPaste =
      editorState.getLastChangeType() === 'insert-fragment';

    if (
      !isEqual(
        this.libDraftJsRef.current.convertToRaw(
          editorState.getCurrentContent(),
        ),
        this.libDraftJsRef.current.convertToRaw(
          this.state.editorState.getCurrentContent(),
        ),
      )
    ) {
      if (shouldFilterPaste) {
        let filteredState = editorState;
        filteredState = this.libDraftJsFiltersRef.current.filterEditorState(
          {
            blocks: ['unordered-list-item', 'ordered-list-item'],
            styles: ['BOLD', 'ITALIC'],
            entities: [
              {
                type: 'LINK',
                attributes: ['url'],
              },
            ],
            whitespacedCharacters: [],
          },
          filteredState,
        );
        editorState = filteredState;
      }
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        text: this.libDraftJsRef.current.convertToRaw(
          editorState.getCurrentContent(),
        ),
      });
    }
    this.setState({ editorState });
  };

  toggleAddNewBlock = () =>
    this.setState((state) => ({ addNewBlockOpened: !state.addNewBlockOpened }));

  handleClickOutside = (e) => {
    if (
      this.props.blockNode.current &&
      doesNodeContainClick(this.props.blockNode.current, e)
    )
      return;
    this.setState(() => ({
      addNewBlockOpened: false,
    }));
  };

  libDraftJsRef = React.createRef();
  libDraftJsFiltersRef = React.createRef();
  libDraftJsInlineToolbarPluginRef = React.createRef();
  libDraftJsIsSoftNewlineEventRef = React.createRef();
  libDraftJsPluginsEditorRef = React.createRef();

  libDraftJsLoaded = (lib) => {
    this.libDraftJsRef.current = lib;
    this.checkLibs();
  };
  libDraftJsFiltersLoaded = (lib) => {
    this.libDraftJsFiltersRef.current = lib;
    this.checkLibs();
  };
  libDraftJsInlineToolbarPluginLoaded = (lib) => {
    this.libDraftJsInlineToolbarPluginRef.current = lib;
    this.checkLibs();
  };
  libDraftJsIsSoftNewlineEventLoaded = (lib) => {
    this.libDraftJsIsSoftNewlineEventRef.current = lib;
    this.checkLibs();
  };
  libDraftJsPluginsEditorLoaded = (lib) => {
    this.libDraftJsPluginsEditorRef.current = lib;
    this.checkLibs();
  };

  checkLibs = () => {
    if (
      !this.libDraftJsRef.current ||
      !this.libDraftJsFiltersRef.current ||
      !this.libDraftJsInlineToolbarPluginRef.current ||
      !this.libDraftJsIsSoftNewlineEventRef.current ||
      !this.libDraftJsPluginsEditorRef.current
    ) {
      return;
    }

    this.Editor = this.libDraftJsPluginsEditorRef.current.default;

    let editorState;
    if (this.props.data && this.props.data.text) {
      editorState = this.libDraftJsRef.current.EditorState.createWithContent(
        this.libDraftJsRef.current.convertFromRaw(this.props.data.text),
      );
    } else {
      editorState = this.libDraftJsRef.current.EditorState.createEmpty();
    }

    const inlineToolbarPlugin = this.libDraftJsInlineToolbarPluginRef.current.default(
      {
        structure: settings.richTextEditorInlineToolbarButtons,
      },
    );

    this.setState(
      {
        editorState,
        inlineToolbarPlugin,
        addNewBlockOpened: false,
      },
      () => {
        if (this.props.selected) {
          // See https://github.com/draft-js-plugins/draft-js-plugins/issues/800
          setTimeout(this.node.focus, 0);
        }
        document.addEventListener('mousedown', this.handleClickOutside, false);
      },
    );
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

    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.text);

    const disableNewBlocks =
      this.props.data?.disableNewBlocks || this.props.detached;

    const InlineToolbar = this.state?.inlineToolbarPlugin?.InlineToolbar;

    return (
      <>
        <LibDraftJsFilters ref={this.libDraftJsFiltersLoaded} />
        <LibDraftJsIsSoftNewlineEvent
          ref={this.libDraftJsIsSoftNewlineEventLoaded}
        />
        <LibDraftJsInlineToolbarPlugin
          ref={this.libDraftJsInlineToolbarPluginLoaded}
        />
        <LibDraftJs ref={this.libDraftJsLoaded} />
        <LibDraftJsPluginsEditor ref={this.libDraftJsPluginsEditorLoaded} />
        {!!this.state.editorState && (
          <this.Editor
            onChange={this.onChange}
            editorState={this.state.editorState}
            plugins={[
              this.state.inlineToolbarPlugin,
              ...settings.richTextEditorPlugins,
            ]}
            blockRenderMap={settings.extendedBlockRenderMap}
            blockStyleFn={settings.blockStyleFn}
            customStyleMap={settings.customStyleMap}
            placeholder={placeholder}
            handleReturn={(e) => {
              if (this.libDraftJsIsSoftNewlineEventRef.current.default(e)) {
                this.onChange(
                  this.libDraftJsRef.current.RichUtils.insertSoftNewline(
                    this.state.editorState,
                  ),
                );
                return 'handled';
              }
              if (!disableNewBlocks) {
                const selectionState = this.state.editorState.getSelection();
                const anchorKey = selectionState.getAnchorKey();
                const currentContent = this.state.editorState.getCurrentContent();
                const currentContentBlock = currentContent.getBlockForKey(
                  anchorKey,
                );
                const blockType = currentContentBlock.getType();
                if (!includes(settings.listBlockTypes, blockType)) {
                  this.props.onSelectBlock(
                    this.props.onAddBlock('text', this.props.index + 1),
                  );
                  return 'handled';
                }
                return 'un-handled';
              }
              return {};
            }}
            handleKeyCommand={(command, editorState) => {
              if (this.props.data.required) {
                return;
              }
              if (
                command === 'backspace' &&
                editorState.getCurrentContent().getPlainText().length === 0
              ) {
                this.props.onDeleteBlock(this.props.block, true);
              }
            }}
            onUpArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const currentCursorPosition = selectionState.getStartOffset();

              if (currentCursorPosition === 0) {
                this.props.onFocusPreviousBlock(this.props.block, this.node);
              }
            }}
            onDownArrow={() => {
              const selectionState = this.state.editorState.getSelection();
              const { editorState } = this.state;
              const currentCursorPosition = selectionState.getStartOffset();
              const blockLength = editorState
                .getCurrentContent()
                .getFirstBlock()
                .getLength();

              if (currentCursorPosition === blockLength) {
                this.props.onFocusNextBlock(this.props.block, this.node);
              }
            }}
            ref={(node) => {
              this.node = node;
            }}
          />
        )}
        {InlineToolbar && <InlineToolbar />}
        {this.props.selected &&
          !disableNewBlocks &&
          !blocks.blocksConfig[
            this.props.data?.['@type'] || 'text'
          ].blockHasValue(this.props.data) && (
            <Button
              basic
              icon
              onClick={this.toggleAddNewBlock}
              className="block-add-button"
            >
              <Icon name={addSVG} className="block-add-button" size="24px" />
            </Button>
          )}
        {this.state.addNewBlockOpened && (
          <BlockChooser
            onMutateBlock={this.props.onMutateBlock}
            currentBlock={this.props.block}
            allowedBlocks={this.props.allowedBlocks}
            showRestricted={this.props.showRestricted}
          />
        )}
      </>
    );
  }
}

export default injectIntl(Edit);
