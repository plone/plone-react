import React from 'react';
import PropTypes from 'prop-types';
import { filter, map, groupBy, isEmpty } from 'lodash';
import { Accordion, Button } from 'semantic-ui-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Icon } from '@plone/volto/components';
import AnimateHeight from 'react-animate-height';
import config from '@plone/volto/registry';

import upSVG from '@plone/volto/icons/up-key.svg';
import downSVG from '@plone/volto/icons/down-key.svg';

const messages = defineMessages({
  fold: {
    id: 'Fold',
    defaultMessage: 'Fold',
  },
  unfold: {
    id: 'Unfold',
    defaultMessage: 'Unfold',
  },
});

const BlockChooser = ({
  currentBlock,
  onInsertBlock,
  onMutateBlock,
  allowedBlocks,
  showRestricted,
  blocksConfig = config.blocks.blocksConfig,
  intl,
  blockChooserRef,
}) => {
  const useAllowedBlocks = !isEmpty(allowedBlocks);

  const filteredBlocksConfig = filter(blocksConfig, (item) => {
    if (showRestricted) {
      if (useAllowedBlocks) {
        return allowedBlocks.includes(item.id);
      } else {
        return true;
      }
    } else {
      if (useAllowedBlocks) {
        return allowedBlocks.includes(item.id);
      } else {
        return !item.restricted;
      }
    }
  });

  let blocksAvailable = {};
  const mostUsedBlocks = filter(filteredBlocksConfig, (item) => item.mostUsed);
  if (mostUsedBlocks) {
    blocksAvailable.mostUsed = mostUsedBlocks;
  }
  const groupedBlocks = groupBy(filteredBlocksConfig, (item) => item.group);
  blocksAvailable = {
    ...blocksAvailable,
    ...groupedBlocks,
  };

  const groupBlocksOrder = filter(config.blocks.groupBlocksOrder, (item) =>
    Object.keys(blocksAvailable).includes(item.id),
  );
  const [activeIndex, setActiveIndex] = React.useState(0);

  function handleClick(e, titleProps) {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  }

  return (
    <div className="blocks-chooser" ref={blockChooserRef}>
      <Accordion fluid styled className="form">
        {map(groupBlocksOrder, (groupName, index) => (
          <React.Fragment key={groupName.id}>
            <Accordion.Title
              aria-label={
                activeIndex === index
                  ? `${intl.formatMessage(messages.fold)} ${
                      groupName.title
                    } blocks`
                  : `${intl.formatMessage(messages.unfold)} ${
                      groupName.title
                    } blocks`
              }
              active={activeIndex === index}
              index={index}
              onClick={handleClick}
            >
              {intl.formatMessage({
                id: groupName.id,
                defaultMessage: groupName.title,
              })}
              <div className="accordion-tools">
                {activeIndex === 0 ? (
                  <Icon name={upSVG} size="20px" />
                ) : (
                  <Icon name={downSVG} size="20px" />
                )}
              </div>
            </Accordion.Title>
            <Accordion.Content
              className={groupName.id}
              active={activeIndex === index}
            >
              <AnimateHeight
                animateOpacity
                duration={500}
                height={activeIndex === index ? 'auto' : 0}
              >
                {map(blocksAvailable[groupName.id], (block) => (
                  <Button.Group key={block.id}>
                    <Button
                      icon
                      basic
                      className={block.id}
                      onClick={(e) => {
                        onInsertBlock
                          ? onInsertBlock(currentBlock, { '@type': block.id })
                          : onMutateBlock(currentBlock, { '@type': block.id });
                        e.stopPropagation();
                      }}
                    >
                      <Icon name={block.icon} size="36px" />
                      {intl.formatMessage({
                        id: block.id,
                        defaultMessage: block.title,
                      })}
                    </Button>
                  </Button.Group>
                ))}
              </AnimateHeight>
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    </div>
  );
};

BlockChooser.propTypes = {
  currentBlock: PropTypes.string.isRequired,
  onMutateBlock: PropTypes.func.isRequired,
  onInsertBlock: PropTypes.func.isRequired,
  allowedBlocks: PropTypes.arrayOf(PropTypes.string),
  blocksConfig: PropTypes.objectOf(PropTypes.any),
};

export default injectIntl(
  React.forwardRef((props, ref) => (
    <BlockChooser {...props} blockChooserRef={ref} />
  )),
  { forwardRef: true },
);
