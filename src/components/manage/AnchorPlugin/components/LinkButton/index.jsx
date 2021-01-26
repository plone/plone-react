import React, { Component } from 'react';
import PropTypes from 'prop-types';
import unionClassNames from 'union-class-names';
import EditorUtils from '../../utils/EditorUtils';
import AddLinkForm from '@plone/volto/components/manage/AnchorPlugin/components/LinkButton/AddLinkForm';
import Icon from '@plone/volto/components/theme/Icon/Icon';

import linkSVG from '@plone/volto/icons/link.svg';
import unlinkSVG from '@plone/volto/icons/unlink.svg';

import loadable from '@loadable/component';
const LibDraftJs = loadable.lib(() => import('draft-js'));

/**
 * Add link form class.
 * @class LinkButton
 * @extends Component
 */
class LinkButton extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    theme: PropTypes.shape({}).isRequired,
    ownTheme: PropTypes.shape({}).isRequired,
    onRemoveLinkAtSelection: PropTypes.func.isRequired,
    onOverrideContent: PropTypes.func.isRequired,
  };

  static defaultProps = {
    placeholder: '',
  };

  state = { libDraftJsIsLoaded: false };

  onMouseDown = (event) => {
    event.preventDefault();
  };

  onAddLinkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { ownTheme, placeholder, onOverrideContent } = this.props;
    const link = this.editorUtils
      .getCurrentEntity(this.props.getEditorState())
      ?.getData()?.url;

    const content = (props) => (
      <AddLinkForm
        {...props}
        placeholder={placeholder}
        theme={ownTheme}
        block="draft-js"
        data={{ url: link || '' }}
        onChangeBlock={() => {}}
      />
    );
    onOverrideContent(content);
  };

  libDraftJsRef = React.createRef();

  libDraftJsLoaded = (lib) => {
    this.libDraftJsRef.current = lib;

    if (this.libDraftJsRef.current) {
      this.editorUtils = EditorUtils(
        this.libDraftJsRef.current.RichUtils,
        this.libDraftJsRef.current.EditorState,
      );

      this.setState({ libDraftJsIsLoaded: true });
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { theme } = this.props;

    // TODO: extract the following into separate pure methods
    let hasLinkSelected = null,
      className = null;
    if (this.state.libDraftJsIsLoaded) {
      hasLinkSelected = this.editorUtils.hasEntity(
        this.props.getEditorState(),
        'LINK',
      );
      className = hasLinkSelected
        ? unionClassNames(theme.button, theme.active)
        : theme.button;
    }

    return (
      <>
        <LibDraftJs ref={this.libDraftJsLoaded} />
        {this.state.libDraftJsIsLoaded && (
          <div
            className={theme.buttonWrapper}
            onMouseDown={this.onMouseDown}
            role="presentation"
          >
            <button
              className={className}
              onClick={
                this.onAddLinkClick
                // hasLinkSelected
                //   ? () =>
                //       onRemoveLinkAtSelection(
                //         this.props.setEditorState,
                //         this.props.getEditorState,
                //       )
                //   : this.onAddLinkClick
              }
              type="button"
            >
              {!hasLinkSelected ? (
                <Icon name={linkSVG} size="24px" />
              ) : (
                <Icon name={unlinkSVG} size="24px" />
              )}
            </button>
          </div>
        )}
      </>
    );
  }
}

export default LinkButton;
