/**
 * WysiwygEditor container.
 * @module components/manage/WysiwygEditor/WysiwygEditor
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Editor from 'draft-js-editor';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML, EditorState, ContentState } from 'draft-js';
import { Form, Label, Segment, TextArea } from 'semantic-ui-react';
import { map } from 'lodash';

/**
 * WysiwygEditor container class.
 * @class WysiwygEditor
 * @extends Component
 */
export default class WysiwygEditor extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    value: PropTypes.shape({
      'content-type': PropTypes.string,
      data: PropTypes.string,
      encoding: PropTypes.string,
    }),
    error: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    value: {
      'content-type': 'text/html',
      data: '',
      encoding: 'utf8',
    },
    error: [],
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
      if (props.value.data) {
        const blocksFromHTML = convertFromHTML(props.value.data);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML);
        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }
      this.state = { editorState };
    }

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * 
   */
  onChange(editorState) {
    this.setState({ editorState });
    this.props.onChange(this.props.id, {
      'content-type': this.props.value['content-type'],
      encoding: this.props.value.encoding,
      data: stateToHTML(editorState.getCurrentContent()),
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, title, description, required, value, error } = this.props;

    if (__SERVER__) {
      return (
        <Form.Field required={required} error={error.length > 0}>
          <label htmlFor={`field-${id}`}>
            {title}
            {description && <span className="help">{description}</span>}
          </label>
          <TextArea id={id} name={id} value={value.data} />
          {map(error, message => (
            <Label key={message} basic color="red" pointing>
              {message}
            </Label>
          ))}
        </Form.Field>
      );
    }
    return (
      <Form.Field required={required} error={error.length > 0}>
        <label htmlFor={`field-${id}`}>
          {title}
          {description && <span className="help">{description}</span>}
        </label>
        <Segment>
          <Editor
            id={`field-${id}`}
            onChange={this.onChange}
            editorState={this.state.editorState}
          />
        </Segment>
        {map(error, message => (
          <Label key={message} basic color="red" pointing>
            {message}
          </Label>
        ))}
      </Form.Field>
    );
  }
}
