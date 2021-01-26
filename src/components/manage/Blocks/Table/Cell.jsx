/**
 * Edit text cell block.
 * @module components/manage/Blocks/Table/Cell
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { includes } from 'lodash';

import { settings } from '~/config';

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

/**
 * Edit text cell class.
 * @class Cell
 * @extends Component
 */
class Cell extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    onSelectCell: PropTypes.func.isRequired,
    row: PropTypes.number,
    cell: PropTypes.number,
    value: PropTypes.object,
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    isTableBlockSelected: PropTypes.bool,
    disableNewBlocks: PropTypes.bool,
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

  constructor(props) {
    super(props);

    settings.getRichTextEditorSettings().then((lib) => {
      this.libRichTextEditorSettingsRef.current = lib;
      this.checkLibs();
    });
  }

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.node) {
      const onFocus = this.node.editor._onFocus;
      this.node.editor._onFocus = (event) => {
        onFocus(event);
        this.props.onSelectCell(this.props.row, this.props.cell);
      };
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
      nextProps.isTableBlockSelected !== this.props.isTableBlockSelected &&
      this.props.cell === 0 &&
      this.props.row === 0
    ) {
      this.node.focus();
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
      this.props.onChange(this.props.row, this.props.cell, editorState);
    });
  };

  checkLibs = () => {
    if (
      !this.libDraftJsRef.current ||
      !this.libDraftJsInlineToolbarPluginRef.current ||
      !this.libDraftJsPluginsEditorRef.current ||
      !this.libDraftJsIsSoftNewlineEventRef.current ||
      !this.libRichTextEditorSettingsRef.current
    ) {
      return;
    }

    this.Editor = this.libDraftJsPluginsEditorRef.current.default;

    let editorState;
    editorState = this.libDraftJsRef.current.EditorState.createWithContent(
      this.libDraftJsRef.current.convertFromRaw(this.props.value),
    );

    const inlineToolbarPlugin = this.libDraftJsInlineToolbarPluginRef.current.default(
      {
        structure: settings.richTextEditorInlineToolbarButtons,
      },
    );

    this.setState({
      editorState,
      inlineToolbarPlugin,
    });
  };

  libDraftJsLoaded = (lib) => {
    this.libDraftJsRef.current = lib;
    this.checkLibs();
  };
  libDraftJsPluginsEditorLoaded = (lib) => {
    this.libDraftJsPluginsEditorRef.current = lib;
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

  libDraftJsPluginsEditorRef = React.createRef();
  libDraftJsRef = React.createRef();
  libDraftJsInlineToolbarPluginRef = React.createRef();
  libDraftJsIsSoftNewlineEventRef = React.createRef();
  libRichTextEditorSettingsRef = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    const InlineToolbar = this.state?.inlineToolbarPlugin?.InlineToolbar;
    return (
      <>
        <LibDraftJsIsSoftNewlineEvent
          ref={this.libDraftJsIsSoftNewlineEventLoaded}
        />
        <LibDraftJsPluginsEditor ref={this.libDraftJsPluginsEditorLoaded} />
        <LibDraftJsInlineToolbarPlugin
          ref={this.libDraftJsInlineToolbarPluginLoaded}
        />
        <LibDraftJs ref={this.libDraftJsLoaded} />
        {!!this.state.editorState && !!this.state.inlineToolbarPlugin && (
          <div>
            <this.Editor
              onChange={this.onChange}
              editorState={this.state.editorState}
              plugins={[
                this.state.inlineToolbarPlugin,
                ...this.libRichTextEditorSettingsRef.current
                  .richTextEditorPlugins,
              ]}
              blockRenderMap={
                this.libRichTextEditorSettingsRef.current.extendedBlockRenderMap
              }
              blockStyleFn={
                this.libRichTextEditorSettingsRef.current.blockStyleFn
              }
              customStyleMap={
                this.libRichTextEditorSettingsRef.current.customStyleMap
              }
              handleReturn={(e) => {
                if (this.libDraftJsIsSoftNewlineEventRef.current.default(e)) {
                  this.onChange(
                    this.libDraftJsRef.current.RichUtils.insertSoftNewline(
                      this.state.editorState,
                    ),
                  );
                  return 'handled';
                }
                if (!this.props.detached && !this.props.disableNewBlocks) {
                  const selectionState = this.state.editorState.getSelection();
                  const anchorKey = selectionState.getAnchorKey();
                  const currentContent = this.state.editorState.getCurrentContent();
                  const currentContentBlock = currentContent.getBlockForKey(
                    anchorKey,
                  );
                  const blockType = currentContentBlock.getType();
                  if (
                    !includes(
                      this.libRichTextEditorSettingsRef.current.listBlockTypes,
                      blockType,
                    )
                  ) {
                    this.props.onSelectBlock(
                      this.props.onAddBlock(
                        settings.defaultBlockType,
                        this.props.index + 1,
                      ),
                    );
                    return 'handled';
                  }
                  return 'un-handled';
                }
                return {};
              }}
              ref={(node) => {
                this.node = node;
              }}
            />
            <InlineToolbar />
          </div>
        )}
      </>
    );
  }
}

export default Cell;
