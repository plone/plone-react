import React from 'react';
import decorateComponentWithProps from 'decorate-component-with-props';

import DefaultLink from './components/Link';
import LinkButton from './components/LinkButton';
import linkStrategy, { matchesEntityType } from './linkStrategy';

import loadable from '@loadable/component';
const LibDraftJs = loadable.lib(() => import('draft-js'));

function removeEntity(editorState, libDraftJsRef) {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const startKey = selectionState.getStartKey();
  const contentBlock = contentState.getBlockForKey(startKey);
  const startOffset = selectionState.getStartOffset();
  const entity = contentBlock.getEntityAt(startOffset);

  if (!entity) {
    return editorState;
  }

  let entitySelection = null;

  contentBlock.findEntityRanges(
    (character) => character.getEntity() === entity,
    (start, end) => {
      entitySelection = selectionState.merge({
        anchorOffset: start,
        focusOffset: end,
        isBackward: false,
      });
    },
  );

  const newContentState = libDraftJsRef.current.Modifier.applyEntity(
    contentState,
    entitySelection,
    null,
  );

  const newEditorState = libDraftJsRef.current.EditorState.push(
    editorState,
    newContentState,
    'apply-entity',
  );

  return newEditorState;
}

export default (config = {}) => {
  // ToDo: Get rif of the remainings of having the original CSS modules
  const defaultTheme = {};

  const { theme = defaultTheme, placeholder, Link, linkTarget } = config;

  return {
    decorators: [
      {
        strategy: linkStrategy,
        matchesEntityType,
        component:
          Link ||
          decorateComponentWithProps(DefaultLink, {
            className: 'link-anchorlink-theme',
            target: linkTarget,
          }),
      },
    ],

    LinkButton: (props) => {
      const libDraftJsRef = React.useRef();

      return (
        <>
          <LibDraftJs ref={libDraftJsRef} />
          <LinkButton
            {...props}
            ownTheme={theme}
            placeholder={placeholder}
            onRemoveLinkAtSelection={(setEditorState, getEditorState) =>
              setEditorState(removeEntity(getEditorState(), libDraftJsRef))
            }
          />
        </>
      );
    },
  };
};
