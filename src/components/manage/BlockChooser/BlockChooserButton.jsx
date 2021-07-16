import React from 'react';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import addSVG from '@plone/volto/icons/circle-plus.svg';
import { blockHasValue } from '@plone/volto/helpers';
import { Icon, BlockChooser } from '@plone/volto/components';
import { Button } from 'semantic-ui-react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  addBlock: {
    id: 'Add block',
    defaultMessage: 'Add block',
  },
});

export const ButtonComponent = (props) => {
  const intl = useIntl();
  const {
    className = 'block-add-button',
    size = '19px',
    onShowBlockChooser,
  } = props;

  return (
    <Button
      icon
      basic
      title={intl.formatMessage(messages.addBlock)}
      onClick={onShowBlockChooser}
      className={className}
    >
      <Icon name={addSVG} className={className} size={size} />
    </Button>
  );
};

const BlockChooserButton = (props) => {
  const {
    block,
    allowedBlocks,
    showRestricted,
    data,
    onMutateBlock,
    onInsertBlock,
    blocksConfig,
    buttonComponent,
    properties,
  } = props;
  const { disableNewBlocks } = data;
  const [addNewBlockOpened, setAddNewBlockOpened] = React.useState(false);

  const blockChooserRef = React.useRef();

  const handleClickOutside = React.useCallback((e) => {
    if (
      blockChooserRef.current &&
      doesNodeContainClick(blockChooserRef.current, e)
    )
      return;
    setAddNewBlockOpened(false);
  }, []);

  const Component = buttonComponent || ButtonComponent;

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
  }, [handleClickOutside]);

  return (
    <>
      {!disableNewBlocks && !blockHasValue(data) ? (
        <Component
          {...props}
          onShowBlockChooser={() => setAddNewBlockOpened(true)}
        />
      ) : null}
      {addNewBlockOpened && (
        <BlockChooser
          onMutateBlock={
            onMutateBlock
              ? (id, value) => {
                  setAddNewBlockOpened(false);
                  onMutateBlock(id, value);
                }
              : null
          }
          onInsertBlock={
            onInsertBlock
              ? (id, value) => {
                  setAddNewBlockOpened(false);
                  onInsertBlock(id, value);
                }
              : null
          }
          currentBlock={block}
          allowedBlocks={allowedBlocks}
          blocksConfig={blocksConfig}
          properties={properties}
          showRestricted={showRestricted}
          ref={blockChooserRef}
        />
      )}
    </>
  );
};

export default BlockChooserButton;
