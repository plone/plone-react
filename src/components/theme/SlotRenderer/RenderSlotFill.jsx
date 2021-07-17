import React from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import config from '@plone/volto/registry';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const defaultAvailable = () => true;

export const RenderSlotFillComponent = (props) => {
  const { id, properties = {}, pathname, slotName, metadata, intl } = props;
  const type = properties['@type'];

  if (type === 'staticFill') {
    const { component, props, available = defaultAvailable } = properties;
    const SlotFill = component;
    return available({ pathname }) ? (
      <SlotFill {...props} id={id} slotName={slotName} />
    ) : null;
  }

  const Block =
    config.blocks.blocksConfig[properties['@type']]?.['view'] || null;

  return Block !== null ? (
    <Block
      id={id}
      metadata={metadata}
      properties={metadata}
      data={properties}
      path={pathname}
    />
  ) : (
    <div>
      {intl.formatMessage(messages.unknownBlock, {
        block: type,
      })}
    </div>
  );
};

export default injectIntl(RenderSlotFillComponent);
