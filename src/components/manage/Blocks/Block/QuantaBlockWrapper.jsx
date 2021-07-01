import React from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import includes from 'lodash/includes';
import isBoolean from 'lodash/isBoolean';
import { defineMessages, injectIntl } from 'react-intl';
import { Icon } from '@plone/volto/components';
import { blockHasValue } from '@plone/volto/helpers';
import { Pluggable, Plug } from '@plone/volto/components/manage/Pluggable';
import MutateBlockButton from './MutateBlockButton';

import config from '@plone/volto/registry';

import moreSVG from '@plone/volto/icons/more.svg';
import dragSVG from '@plone/volto/icons/drag.svg';
import trashSVG from '@plone/volto/icons/delete.svg';

const messages = defineMessages({
  delete: {
    id: 'delete',
    defaultMessage: 'delete',
  },
});

const EditBlockWrapper = (props) => {
  const hideHandler = (data) => {
    return !!data.fixed || !blockHasValue(data);
  };

  const { intl, blockProps, draginfo, children } = props;
  const { block, data, onDeleteBlock, selected, type } = blockProps;
  const visible = selected && !hideHandler(data);

  const required = isBoolean(data.required)
    ? data.required
    : includes(config.blocks.requiredBlocks, type);

  return (
    <div
      ref={draginfo.innerRef}
      {...draginfo.draggableProps}
      className={`quanta-block quanta-block-editor-${data['@type']}`}
    >
      {selected && (
        <div className="toolbar quanta-block-toolbar">
          <Pluggable name="block-toolbar" params={blockProps} />
          <Plug pluggable="block-toolbar" id="drag-handle">
            <Button
              style={{
                visibility: visible ? 'visible' : 'visible',
                display: 'inline-block',
              }}
              {...draginfo.dragHandleProps}
              icon
              basic
            >
              <Icon name={dragSVG} size="18px" />
            </Button>
          </Plug>
          <Plug pluggable="block-toolbar" id="mutate-block-button">
            <>
              <MutateBlockButton
                {...blockProps}
                onInsertBlock={(id, value) => {
                  blockProps.onSelectBlock(blockProps.onInsertBlock(id, value));
                }}
                className="quanta-block-add-button"
              />
            </>
          </Plug>
          <Plug pluggable="block-toolbar" id="more-button">
            <Pluggable name="block-toolbar-more">
              {({ children }) => {
                return children ? (
                  <Button basic icon>
                    <Dropdown
                      item
                      icon={<Icon name={moreSVG} size="18px" color="#826a6a" />}
                      className=""
                    >
                      <Dropdown.Menu className="right">
                        <Dropdown.Header content="More actions" />
                        <Dropdown.Menu scrolling>
                          <Dropdown.Item>something</Dropdown.Item>
                          {/* <Dropdown.Item */}
                          {/*   key={index} */}
                          {/*   value={index} */}
                          {/*   onClick={this.onSelectIndex} */}
                          {/*   className="iconAlign" */}
                          {/* > */}
                          {/*   {this.state.index.values[index].selected ? ( */}
                          {/*     <Icon */}
                          {/*       name={checkboxCheckedSVG} */}
                          {/*       size="24px" */}
                          {/*       color="#007eb1" */}
                          {/*       className={this.state.index.values[index].label} */}
                          {/*     /> */}
                          {/*   ) : ( */}
                          {/*     <Icon */}
                          {/*       name={checkboxUncheckedSVG} */}
                          {/*       className={this.state.index.values[index].label} */}
                          {/*       size="24px" */}
                          {/*     /> */}
                          {/*   )} */}
                          {/*   <span> */}
                          {/*     {' '} */}
                          {/*     {this.props.intl.formatMessage({ */}
                          {/*       id: this.state.index.values[index].label, */}
                          {/*       defaultMessage: this.state.index.values[index] */}
                          {/*         .label, */}
                          {/*     })} */}
                          {/*   </span> */}
                          {/* </Dropdown.Item> */}
                        </Dropdown.Menu>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Button>
                ) : (
                  !required && (
                    <Button
                      icon
                      basic
                      onClick={() => onDeleteBlock(block)}
                      className="delete-button"
                      aria-label={intl.formatMessage(messages.delete)}
                    >
                      <Icon name={trashSVG} size="18px" />
                    </Button>
                  )
                );
              }}
            </Pluggable>
          </Plug>
        </div>
      )}
      <div className={`ui drag block inner ${type}`}>{children}</div>
    </div>
  );
};

export default injectIntl(EditBlockWrapper);
