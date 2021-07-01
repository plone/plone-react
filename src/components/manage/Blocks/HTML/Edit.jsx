/**
 * Edit html block.
 * @module components/manage/Blocks/HTML/Edit
 */

import { compose } from 'redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import loadable from '@loadable/component';
import { isEqual } from 'lodash';

import { Icon } from '@plone/volto/components';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';
import showSVG from '@plone/volto/icons/show.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import codeSVG from '@plone/volto/icons/code.svg';
import indentSVG from '@plone/volto/icons/indent.svg';
import config from '@plone/volto/registry';
import { Plug } from '@plone/volto/components/manage/Pluggable';

const Editor = loadable(() => import('react-simple-code-editor'));

const messages = defineMessages({
  source: {
    id: 'Source',
    defaultMessage: 'Source',
  },
  preview: {
    id: 'Preview',
    defaultMessage: 'Preview',
  },
  placeholder: {
    id: '<p>Add some HTML here</p>',
    defaultMessage: '<p>Add some HTML here</p>',
  },
  prettier: {
    id: 'Prettify your code',
    defaultMessage: 'Prettify your code',
  },
  clear: {
    id: 'Clear',
    defaultMessage: 'Clear',
  },
  code: {
    id: 'Code',
    defaultMessage: 'Code',
  },
});

/**
 * Edit html block class.
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
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    editable: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    editable: true,
  };
  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   */
  constructor(props) {
    super(props);
    this.state = {
      isPreview: false,
    };
    this.onChangeCode = this.onChangeCode.bind(this);
    this.onPreview = this.onPreview.bind(this);
    this.onCodeEditor = this.onCodeEditor.bind(this);
  }

  codeEditorRef = React.createRef();
  savedSelection = {};

  componentDidUpdate(prevProps, prevState, snapshot) {
    // The selection is saved in the snapshot.
    this.savedSelection = snapshot;

    this.restoreSelectionAndFocus(this.codeEditorRef.current);
  }

  /**
   * @param {*} nextProps
   * @param {*} nextState
   * @returns {boolean}
   * @memberof Edit
   */
  shouldComponentUpdate(nextProps) {
    // Always rerender when the DOM node is not created for the Editor (the
    // first call to shouldComponentUpdate).
    if (!this._input) {
      return true;
    }

    // Rerender the entire component when the Editor in it changes its selection
    // because this way we get a call to getSnapshotBeforeUpdate where we can
    // save the selection.
    return (
      this.props.selected ||
      !isEqual(this.props.data, nextProps.data) ||
      this._input.selectionStart !== this.savedSelection.selectionStart ||
      this._input.selectionEnd !== this.savedSelection.selectionEnd
    );
  }

  /**
   * Change html handler
   * @method onChangeCode
   * @param {string} code New value html
   * @returns {undefined}
   */
  onChangeCode(code) {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      html: code,
    });
  }

  getValue() {
    return this.props.data.html || '';
  }

  /**
   * Preview mode handler
   * @method onPreview
   * @returns {undefined}
   */
  onPreview() {
    try {
      const code = this.props.prettierStandalone
        .format(this.getValue(), {
          parser: 'html',
          plugins: [this.props.prettierParserHtml],
        })
        .trim();
      this.setState(
        {
          isPreview: !this.state.isPreview,
        },
        () => this.onChangeCode(code),
      );
    } catch (ex) {
      // error while parsing the user-typed HTML
      // TODO: show a toast notification or something similar to the user
    }
  }

  /**
   * Prettify handler
   * @method onPrettify
   * @returns {undefined}
   */
  onPrettify = () => {
    try {
      const code = this.props.prettierStandalone
        .format(this.getValue(), {
          parser: 'html',
          plugins: [this.props.prettierParserHtml],
        })
        .trim();
      this.onChangeCode(code);
    } catch (ex) {
      // error while parsing the user-typed HTML
      // TODO: show a toast notification or something similar to the user
    }
  };

  /**
   * Code Editor mode handler
   * @method onPreview
   * @returns {undefined}
   */
  onCodeEditor() {
    this.setState({ isPreview: !this.state.isPreview });
  }

  getSelection = (editor) => {
    if (!editor._input) {
      return {};
    }

    const o = {};
    if (editor._input.selectionStart) {
      o.selectionStart = editor._input.selectionStart;
    }
    if (editor._input.selectionEnd) {
      o.selectionEnd = editor._input.selectionEnd;
    }
    return o;
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return this.getSelection(this.codeEditorRef.current);
  }

  restoreSelectionAndFocus = (editor) => {
    // Don't restore selection when the block is not selected.
    if (
      this.props.selected &&
      editor._input &&
      typeof this.savedSelection?.selectionStart === 'number' &&
      typeof this.savedSelection?.selectionEnd === 'number'
    ) {
      editor._input.selectionStart = this.savedSelection?.selectionStart;
      editor._input.selectionEnd = this.savedSelection?.selectionEnd;
      editor._input.focus();
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.placeholder);
    const value = this.getValue();
    const PlugInsert = config.settings.useQuantaToolbar
      ? Plug
      : ({ children }) => children;
    return (
      <>
        {this.props.selected && value && (
          <div className="toolbar">
            <PlugInsert pluggable="block-toolbar" id="html-buttons">
              <Popup
                trigger={
                  <Button
                    icon
                    basic
                    aria-label={this.props.intl.formatMessage(messages.source)}
                    active={!this.state.isPreview}
                    onClick={this.onCodeEditor}
                  >
                    <Icon name={codeSVG} size="24px" />
                  </Button>
                }
                position="top center"
                content={this.props.intl.formatMessage(messages.code)}
                size="mini"
              />
              <Popup
                trigger={
                  <Button
                    icon
                    basic
                    aria-label={this.props.intl.formatMessage(messages.preview)}
                    active={this.state.isPreview}
                    onClick={this.onPreview}
                  >
                    <Icon name={showSVG} size="24px" />
                  </Button>
                }
                position="top center"
                content={this.props.intl.formatMessage(messages.preview)}
                size="mini"
              />
              <Popup
                trigger={
                  <Button
                    icon
                    basic
                    aria-label={this.props.intl.formatMessage(
                      messages.prettier,
                    )}
                    onClick={this.onPrettify}
                  >
                    <Icon name={indentSVG} size="24px" />
                  </Button>
                }
                position="top center"
                content={this.props.intl.formatMessage(messages.prettier)}
                size="mini"
              />
              <div className="separator" />
              <Popup
                trigger={
                  <Button.Group>
                    <Button icon basic onClick={() => this.onChangeCode('')}>
                      <Icon name={clearSVG} size="24px" color="#e40166" />
                    </Button>
                  </Button.Group>
                }
                position="top center"
                content={this.props.intl.formatMessage(messages.clear)}
                size="mini"
              />
            </PlugInsert>
          </div>
        )}
        {this.state.isPreview ? (
          <div dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <Editor
            value={this.getValue()}
            readOnly={!this.props.editable}
            placeholder={placeholder}
            onValueChange={(code) => this.onChangeCode(code)}
            highlight={
              this.props.prismCore?.highlight &&
              this.props.prismCore?.languages?.html
                ? (code) =>
                    this.props.prismCore.highlight(
                      code,
                      this.props.prismCore.languages.html,
                      'html',
                    )
                : () => {}
            }
            padding={8}
            className="html-editor"
            ref={(node) => {
              if (node) {
                this.codeEditorRef.current = node;
              }
            }}
            ignoreTabKey={true}
          />
        )}
      </>
    );
  }
}

const withPrismMarkup = (WrappedComponent) => (props) => {
  const [loaded, setLoaded] = React.useState();
  const promise = React.useRef(null);
  const cancelled = React.useRef(false);

  React.useEffect(() => {
    promise.current = import('prismjs/components/prism-markup');
    promise.current.then(() => {
      if (!cancelled.current) {
        setLoaded(true);
      }
    });
    return () => {
      cancelled.current = true;
    };
  }, []);

  return loaded ? <WrappedComponent {...props} /> : null;
};

export default compose(
  injectLazyLibs(['prettierStandalone', 'prettierParserHtml', 'prismCore']),
  withPrismMarkup,
  injectIntl,
)(Edit);
