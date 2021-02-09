import React from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { SlotRenderer } from '@plone/volto/components';
import { matchPath, useLocation } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { slots } from '~/config';

const ContentContainer = ({ children, content }) => {
  const pathname = useLocation().pathname;
  const hasSlot = (name) => {
    if (!slots[name]) {
      return null;
    }
    return slots[name].filter((slot) =>
      matchPath(pathname, { path: slot.path, exact: slot.exact }),
    );
  };
  const hasLeftSlot = !isEmpty(hasSlot('asideLeftSlot'));
  const hasRightSlot = !isEmpty(hasSlot('asideRightSlot'));

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
              <SlotRenderer name="asideLeftSlot" />
            </Grid.Column>
          )}
          <Grid.Column className="content-body" width={contentWidth()}>
            {children}
          </Grid.Column>
          {hasRightSlot && (
            <Grid.Column as="aside" className="aside-right-slot" width={3}>
              <SlotRenderer name="asideRightSlot" />
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
