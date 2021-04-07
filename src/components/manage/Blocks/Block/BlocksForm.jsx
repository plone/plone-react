import React from 'react';
import EditBlock from './Edit';
import { DragDropList } from '@plone/volto/components';
import { getBlocks } from '@plone/volto/helpers';
import {
  addBlock,
  addBlockBefore,
  changeBlock,
  deleteBlock,
  moveBlock,
  mutateBlock,
  nextBlockId,
  previousBlockId,
} from '@plone/volto/helpers';
import EditBlockWrapper from './EditBlockWrapper';
import config from '@plone/volto/registry';

const BlocksForm = (props) => {
  const {
    pathname,
    onChangeField,
    properties,
    onChangeFormData,
    selectedBlock,
    multiSelected,
    onSelectBlock,
    allowedBlocks,
    showRestricted,
    title,
    description,
    metadata,
    manage,
    children,
    blocksConfig = config.blocks.blocksConfig,
  } = props;

  const blockList = getBlocks(properties);

  const handleKeyDown = (
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) => {
    const isMultipleSelection = e.shiftKey;
    if (e.key === 'ArrowUp' && !disableArrowUp) {
      onFocusPreviousBlock(block, node, isMultipleSelection);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown) {
      onFocusNextBlock(block, node, isMultipleSelection);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter) {
      onAddBlock(config.settings.defaultBlockType, index + 1);
      e.preventDefault();
    }
  };

  const onFocusPreviousBlock = (
    currentBlock,
    blockNode,
    isMultipleSelection,
  ) => {
    const prev = previousBlockId(properties, currentBlock);
    if (prev === null) return;

    blockNode.blur();

    onSelectBlock(prev, isMultipleSelection);
  };

  const onFocusNextBlock = (currentBlock, blockNode, isMultipleSelection) => {
    const next = nextBlockId(properties, currentBlock);
    if (next === null) return;

    blockNode.blur();

    onSelectBlock(next, isMultipleSelection);
  };

  const onMutateBlock = (id, value) => {
    const newFormData = mutateBlock(properties, id, value);
    onChangeFormData(newFormData);
  };

  const onInsertBlock = (id, value) => {
    const [newId, newFormData] = addBlockBefore(properties, id, value);
    onChangeFormData(newFormData);
    return newId;
  };

  const onAddBlock = (type, index) => {
    const [id, newFormData] = addBlock(properties, type, index);
    onChangeFormData(newFormData);
    return id;
  };

  const onChangeBlock = (id, value) => {
    const newFormData = changeBlock(properties, id, value);
    onChangeFormData(newFormData);
  };

  const onDeleteBlock = (id, selectPrev) => {
    const previous = previousBlockId(properties, id);

    const newFormData = deleteBlock(properties, id);
    onChangeFormData(newFormData);

    onSelectBlock(selectPrev ? previous : null);
  };

  const onMoveBlock = (dragIndex, hoverIndex) => {
    const newFormData = moveBlock(properties, dragIndex, hoverIndex);
    onChangeFormData(newFormData);
  };

  const defaultBlockWrapper = ({ draginfo }, editBlock, blockProps) => (
    <EditBlockWrapper draginfo={draginfo} blockProps={blockProps}>
      {editBlock}
    </EditBlockWrapper>
  );

  const editBlockWrapper = children || defaultBlockWrapper;

  return (
    <div className="blocks-form">
      <DragDropList
        childList={blockList}
        onMoveItem={(result) => {
          const { source, destination } = result;
          if (!destination) {
            return;
          }
          const newFormData = moveBlock(
            properties,
            source.index,
            destination.index,
          );
          onChangeFormData(newFormData);
          return true;
        }}
      >
        {(dragProps) => {
          const { child, childId, index } = dragProps;
          const blockProps = {
            allowedBlocks,
            showRestricted,
            block: childId,
            data: child,
            handleKeyDown,
            id: childId,
            formTitle: title,
            formDescription: description,
            index,
            manage,
            onAddBlock,
            onInsertBlock,
            onChangeBlock,
            onChangeField,
            onDeleteBlock,
            onFocusNextBlock,
            onFocusPreviousBlock,
            onMoveBlock,
            onMutateBlock,
            onSelectBlock,
            pathname,
            metadata,
            properties,
            blocksConfig,
            selected: selectedBlock === childId,
            multiSelected: multiSelected?.includes(childId),
            type: child['@type'],
          };
          return editBlockWrapper(
            dragProps,
            <EditBlock key={childId} {...blockProps} />,
            blockProps,
          );
        }}
      </DragDropList>
    </div>
  );
};

export default BlocksForm;
