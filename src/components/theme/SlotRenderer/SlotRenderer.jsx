import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RenderSlotFill from './RenderSlotFill';
import { v4 as uuid } from 'uuid';

import Registry from '@plone/volto/registry';

const DefaultSlotWrapper = ({ name, children }) => (
  <div className={`slot-${name}`}>{children}</div>
);

const defaultComputeLayout = ({ staticFills, persistentFills }) => [
  ...(persistentFills.blocks_layout?.items || []),
  ...(staticFills || []).map(({ id }) => id),
];

const SlotRenderer = ({ name, metadata }) => {
  const { pathname } = useLocation();

  // a 'properties' like object, with blocks_layout and blocks
  const persistentFillsData = useSelector((state) => {
    return state.slots?.data?.items?.[name] || {};
  });

  const { slots } = Registry;
  if (!slots[name]) {
    return null;
  }

  const slotDefinition = slots[name];
  const {
    computeLayout = defaultComputeLayout,
    RenderChild = RenderSlotFill,
    component: SlotWrapper = DefaultSlotWrapper,
    items: staticFillsData = [],
  } = slotDefinition;

  // assign ids to static fills, if they don't exist
  // this mutatates the config registry!
  staticFillsData.forEach((item) => {
    if (!item.id) item.id = uuid();
  });

  const components = Object.assign(
    {
      ...persistentFillsData.blocks,
    },
    ...staticFillsData.map((info) => ({
      [info.id]: { '@type': 'staticFill', ...info },
    })),
  );

  const layout = computeLayout({
    staticFills: staticFillsData,
    persistentFills: persistentFillsData,
  });

  return (
    <SlotWrapper name={name}>
      {layout.map((id) => (
        <RenderChild
          key={id}
          id={id}
          slotName={name}
          pathname={pathname}
          properties={components[id]}
          metadata={metadata}
        />
      ))}
    </SlotWrapper>
  );
};

export default SlotRenderer;
