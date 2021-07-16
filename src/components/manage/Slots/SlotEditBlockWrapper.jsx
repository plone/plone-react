import React from 'react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import QuantaEditBlockWrapper from '@plone/volto/components/manage/Blocks/Block/QuantaEditBlockWrapper';
import { Plug } from '@plone/volto/components/manage/Pluggable';
import { BlockToolbarItem } from '@plone/volto/components';
import { v4 as uuid } from 'uuid';

// import lockSVG from '@plone/volto/icons/lock.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';
import lockOffSVG from '@plone/volto/icons/lock-off.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

export const customizeBlock = (block, data, formData) => {
  const newId = uuid();
  const newFormData = {
    blocks_layout: {
      ...formData.blocks_layout,
      items: [...formData.blocks_layout.items],
    },
    blocks: {
      ...formData.blocks,
      [newId]: {
        ...formData.blocks[block],
        's:isVariantOf': block,
        _v_original: { ...data },
      },
    },
  };

  delete newFormData.blocks[block];

  const ix = formData.blocks_layout.items.indexOf(block);
  newFormData.blocks_layout.items[ix] = newId;
  return [newFormData, newId];
};

export const restoreBlock = (block, data, formData) => {
  const oldId = data['s:isVariantOf'];

  const newFormData = {
    blocks_layout: {
      ...formData.blocks_layout,
      items: [...formData.blocks_layout.items],
    },
    blocks: {
      ...formData.blocks,
      [oldId]: {
        ...data._v_original, //  || formData.blocks[oldId]
      },
    },
  };

  delete newFormData.blocks[block];

  const ix = formData.blocks_layout.items.indexOf(block);
  newFormData.blocks_layout.items[ix] = oldId;
  return [newFormData, oldId];
};

const SlotEditBlockWrapper = (props) => {
  const { blockProps } = props;
  const {
    data,
    selected,
    block,
    // onChangeBlock,
    onChangeField,
    onSelectBlock,
    properties,
  } = blockProps;
  const inherited = data._v_inherit ? 'slot-inherited' : null;
  const blockIsHidden = !!data['v:hidden'];
  const blockIsVariant = !!data['s:isVariantOf'];

  return (
    <>
      <QuantaEditBlockWrapper
        {...props}
        classNames={cx('slot-editor', `slot-editor-${data['@type']}`, {
          'slot-inherited': inherited,
          'slot-hidden': blockIsHidden,
        })}
      />

      {/* Override the classic (+) block chooser button, if it exists */}
      <Plug
        pluggable="block-toolbar-main"
        id="mutate-block-button-classic"
        dependencies={[blockProps]}
      >
        <></>
      </Plug>

      {selected && blockIsVariant && (
        <Plug
          pluggable="block-toolbar-extra"
          id="delete-button"
          dependencies={[blockProps]}
          extra={{ group: 'slot' }}
        >
          {(options) => {
            return (
              <BlockToolbarItem
                {...options}
                label={blockIsHidden ? 'Show original' : 'Delete variation'}
                icon={blockIsHidden ? showSVG : trashSVG}
                onClick={() => {
                  ReactDOM.unstable_batchedUpdates(() => {
                    const [newFormData, blockId] = restoreBlock(
                      block,
                      data,
                      properties,
                    );
                    newFormData.blocks[blockId]._v_inherit = true;
                    newFormData.blocks[blockId].readOnly = true;

                    onChangeField('blocks', newFormData['blocks']);
                    onChangeField(
                      'blocks_layout',
                      newFormData['blocks_layout'],
                    );

                    onSelectBlock(blockId);
                  });
                }}
              />
            );
          }}
        </Plug>
      )}

      {selected && blockIsHidden && (
        <Plug
          pluggable="block-toolbar-main"
          id="mutate-block-button"
          dependencies={[blockProps]}
        >
          <></>
        </Plug>
      )}

      {selected && !blockIsHidden && inherited && (
        <Plug
          pluggable="block-toolbar-main"
          id="lockunlock-slot-fill"
          dependencies={[blockProps]}
        >
          {(options) => {
            return (
              <BlockToolbarItem
                {...options}
                label="Unlock fill"
                icon={lockOffSVG}
                onClick={() => {
                  ReactDOM.unstable_batchedUpdates(() => {
                    const [newFormData, blockId] = customizeBlock(
                      block,
                      data,
                      properties,
                    );
                    delete newFormData.blocks[blockId]._v_inherit;
                    delete newFormData.blocks[blockId].readOnly;

                    onChangeField('blocks', newFormData['blocks']);
                    onChangeField(
                      'blocks_layout',
                      newFormData['blocks_layout'],
                    );

                    onSelectBlock(blockId);
                  });
                }}
              />
            );
          }}
        </Plug>
      )}

      {selected && inherited && (
        <>
          <Plug
            pluggable="block-toolbar-main"
            id="hide-slot-fill"
            dependencies={[blockProps]}
          >
            {(options) => {
              return (
                <BlockToolbarItem
                  {...options}
                  label={blockIsHidden ? 'Unhide slot fill' : 'Hide slot fill'}
                  icon={blockIsHidden ? showSVG : hideSVG}
                  onClick={() => {
                    ReactDOM.unstable_batchedUpdates(() => {
                      const op = blockIsHidden ? restoreBlock : customizeBlock;
                      const [newFormData, blockId] = op(
                        block,
                        data,
                        properties,
                      );
                      newFormData.blocks[blockId] = {
                        ...newFormData.blocks[blockId],
                        'v:hidden': !blockIsHidden,
                      };

                      if (!blockIsHidden) {
                        delete newFormData.blocks[blockId]._v_inherit;
                      }
                      onChangeField('blocks', newFormData['blocks']);
                      onChangeField(
                        'blocks_layout',
                        newFormData['blocks_layout'],
                      );

                      onSelectBlock(blockId);
                    });
                  }}
                />
              );
            }}
          </Plug>
          {/* Hide the mutate and delete buttons, if slot is inherited */}
          <Plug
            pluggable="block-toolbar-main"
            id="mutate-block-button"
            dependencies={[blockProps]}
          >
            <></>
          </Plug>
          <Plug
            pluggable="block-toolbar-extra"
            id="delete-button"
            dependencies={[blockProps]}
            extra={{ group: 'slot' }}
          >
            <></>
          </Plug>
        </>
      )}
    </>
  );
};

export default injectIntl(SlotEditBlockWrapper);
