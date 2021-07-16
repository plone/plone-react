import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { SlotRenderer } from '@plone/volto/components';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import { isSlotAvailable } from '@plone/volto/helpers';

const ContentContainer = ({ children, content }) => {
  const pathname = useLocation().pathname;
  const { slots } = config;
  const slotData = useSelector((state) => state.slots?.data || {});

  const available = (name) => {
    if (!slots[name]) {
      return null;
    }
    const props = { pathname, slotData, slotName: name, slots, content };
    return slots[name].available
      ? slots[name].available(props)
      : isSlotAvailable(props);
  };

  const hasLeftSlot = available('asideLeftSlot');
  const hasRightSlot = available('asideRightSlot');

  const contentWidth = () => {
    if (hasLeftSlot && hasRightSlot) {
      return 6;
    } else if (hasLeftSlot || hasRightSlot) {
      return 9;
    } else {
      return 12;
    }
  };

  return (
    <>
      {hasLeftSlot || hasRightSlot ? (
        <Grid stackable as={Container}>
          {hasLeftSlot && (
            <Grid.Column as="aside" className="aside-left-slot" width={3}>
              <SlotRenderer name="asideLeftSlot" metadata={content} />
            </Grid.Column>
          )}
          <Grid.Column className="content-body" width={contentWidth()}>
            {children}
          </Grid.Column>
          {hasRightSlot && (
            <Grid.Column as="aside" className="aside-right-slot" width={3}>
              <SlotRenderer name="asideRightSlot" metadata={content} />
            </Grid.Column>
          )}
        </Grid>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default ContentContainer;
