/**
 * WysiwygWidget container.
 * @module components/manage/WysiwygWidget/WysiwygWidget
 */

import { FormFieldWrapper } from '@plone/volto/components';
import { convertToRaw, EditorState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import Editor from 'draft-js-plugins-editor';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import { injectIntl } from 'react-intl';
import { connect, Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import redraft from 'redraft';
import { compose } from 'redux';
import configureStore from 'redux-mock-store';
import { Form, Label, TextArea } from 'semantic-ui-react';
import { settings } from '~/config';

/**
 * WysiwygWidget container class.
 * @class WysiwygWidget
 * @extends Component
 */
class WysiwygWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    /**
     * Id of the field
     */
    id: PropTypes.string.isRequired,
    /**
     * Title of the field
     */
    title: PropTypes.string.isRequired,
    /**
     * Description of the field
     */
    description: PropTypes.string,
    /**
     * True if field is required
     */
    required: PropTypes.bool,
    /**
     * Value of the field
     */
    value: PropTypes.shape({
      /**
       * Content type of the value
       */
      'content-type': PropTypes.string,
      /**
       * Data of the value
       */
      data: PropTypes.string,
      /**
       * Encoding of the value
       */
      encoding: PropTypes.string,
    }),
    /**
     * List of error messages
     */
    error: PropTypes.arrayOf(PropTypes.string),
    /**
     * On change handler
     */
    onChange: PropTypes.func,
    /**
     * On delete handler
     */
    onDelete: PropTypes.func,
    /**
     * On edit handler
     */
    onEdit: PropTypes.func,
    isDraggable: PropTypes.bool,
    isDisabled: PropTypes.bool,
    /**
     * Wrapped form component
     */
    wrapped: PropTypes.bool,
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
    onEdit: null,
    onDelete: null,
    onChange: null,
    isDraggable: false,
    isDisabled: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygWidget
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState;
      if (props.value && props.value.data) {
        const contentState = stateFromHTML(props.value.data, {
          customBlockFn: settings.FromHTMLCustomBlockFn,
        });
        editorState = EditorState.createWithContent(contentState);
      } else {
        editorState = EditorState.createEmpty();
      }

      const inlineToolbarPlugin = createInlineToolbarPlugin({
        structure: settings.richTextEditorInlineToolbarButtons,
      });

      this.state = { editorState, inlineToolbarPlugin };
    }

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(editorState) {
    this.setState({ editorState });
    const mockStore = configureStore();

    this.props.onChange(this.props.id, {
      'content-type': this.props.value
        ? this.props.value['content-type']
        : 'text/html',
      encoding: this.props.value ? this.props.value.encoding : 'utf8',
      data: ReactDOMServer.renderToStaticMarkup(
        <Provider
          store={mockStore({
            userSession: {
              token: this.props.token,
            },
          })}
        >
          <MemoryRouter>
            {redraft(
              convertToRaw(editorState.getCurrentContent()),
              settings.ToHTMLRenderers,
              settings.ToHTMLOptions,
            )}
          </MemoryRouter>
        </Provider>,
      ),
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      title,
      description,
      required,
      value,
      error,
      onEdit,
      onDelete,
      fieldSet,
      intl,
      isDraggable,
      isDisabled,
    } = this.props;

    if (__SERVER__) {
      return (
        <Form.Field
          inline
          required={required}
          error={error.length > 0}
          className={description ? 'help' : ''}
          id={`${fieldSet || 'field'}-${id}`}
        >
          <div className="wrapper">
            <label htmlFor={`field-${id}`}>{title}</label>
            <TextArea id={id} name={id} value={value ? value.data : ''} />
            {description && <p className="help">{description}</p>}
            {map(error, (message, index) => (
              <Label key={message} basic color="red" pointing>
                {message}
              </Label>
            ))}
          </div>
        </Form.Field>
      );
    }
    const { InlineToolbar } = this.state.inlineToolbarPlugin;

    return (
      <FormFieldWrapper
        {...this.props}
        onEdit={onEdit ? () => onEdit(id) : null}
        onDelete={onDelete}
        draggable={isDraggable}
        isDisabled={isDisabled}
        intl={intl}
        className="wysiwyg"
      >
        <div style={{ boxSizing: 'initial' }}>
          {this.props.onChange ? (
            <>
              <Editor
                id={`field-${id}`}
                onChange={this.onChange}
                editorState={this.state.editorState}
                plugins={[
                  this.state.inlineToolbarPlugin,
                  ...settings.richTextEditorPlugins,
                ]}
                blockRenderMap={settings.extendedBlockRenderMap}
                blockStyleFn={settings.blockStyleFn}
                customStyleMap={settings.customStyleMap}
              />
              {this.props.onChange && <InlineToolbar />}
            </>
          ) : (
            <div className="DraftEditor-root" />
          )}
        </div>
      </FormFieldWrapper>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      token: state.userSession.token,
    }),
    {},
  ),
)(WysiwygWidget);
