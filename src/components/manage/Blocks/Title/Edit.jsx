/**
 * Edit title tile.
 * @module components/manage/Tiles/Title/Edit
 */

import React, { Component } from 'react';
import { Map } from 'immutable';
import PropTypes from 'prop-types';
import { stateFromHTML } from 'draft-js-import-html';
import { Editor, DefaultDraftBlockRenderMap, EditorState } from 'draft-js';
import { defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
  title: {
    id: 'Type the title…',
    defaultMessage: 'Type the title…',
  },
});

const blockRenderMap = Map({
  unstyled: {
    element: 'h1',
  },
});

const extendedBlockRenderMap = DefaultDraftBlockRenderMap.merge(blockRenderMap);

/**
 * Edit title tile class.
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
    index: PropTypes.number.isRequired,
    onChangeField: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    onAddTile: PropTypes.func.isRequired,
    onFocusPreviousTile: PropTypes.func.isRequired,
    onFocusNextTile: PropTypes.func.isRequired,
    tile: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      if (props.properties && props.properties.title) {
        const contentState = stateFromHTML(props.properties.title);
        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }
      this.state = { editorState, focus: true };
    }

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.node) {
      this.node.focus();
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
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.properties.title &&
      this.props.properties.title !== nextProps.properties.title &&
      !this.state.focus
    ) {
      const contentState = stateFromHTML(nextProps.properties.title);
      this.setState({
        editorState: nextProps.properties.title
          ? EditorState.createWithContent(contentState)
          : EditorState.createEmpty(),
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
  onChange(editorState) {
    this.setState({ editorState }, () => {
      this.props.onChangeField(
        'title',
        editorState.getCurrentContent().getPlainText(),
      );
    });
  }

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
      <Editor
        onChange={this.onChange}
        editorState={this.state.editorState}
        blockRenderMap={extendedBlockRenderMap}
        handleReturn={() => {
          this.props.onSelectTile(
            this.props.onAddTile('text', this.props.index + 1),
          );
          return 'handled';
        }}
        placeholder={this.props.intl.formatMessage(messages.title)}
        blockStyleFn={() => 'documentFirstHeading'}
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
            this.props.onFocusPreviousTile(this.props.tile, this.node);
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
            this.props.onFocusNextTile(this.props.tile, this.node);
          }
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
  }
}

export default injectIntl(Edit);
