import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SlotRenderer from './SlotRenderer';
import { slots } from '~/config';

describe('SlotRenderer Component', () => {
  test('renders a SlotRenderer component for the aboveContentTitle with two slots in the root', () => {
    slots.aboveContentTitle = [
      {
        path: '/',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component' },
      },
      {
        path: '/',
        component: (props) => <aside {...props} />,
        props: { className: 'slot-component' },
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toHaveClass('slot-component');
    const asideSlot = container.querySelector('aside');
    expect(asideSlot).toHaveClass('slot-component');
  });
  test('renders a SlotRenderer component for the aboveContentTitle with one slots in the root and other in other place', () => {
    slots.aboveContentTitle = [
      {
        path: '/',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component' },
      },
      {
        path: '/other-place',
        component: (props) => <aside {...props} />,
        props: { className: 'slot-component' },
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toHaveClass('slot-component');
    const asideSlot = container.querySelector('aside');
    expect(asideSlot).toBe(null);
  });
  test('renders a SlotRenderer component for the aboveContentTitle and belowContentTitle, only renders the appropiate one', () => {
    slots.aboveContentTitle = [
      {
        path: '/',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component-aboveContentTitle' },
      },
    ];
    slots.belowContentTitle = [
      {
        path: '/',
        component: (props) => <aside {...props} />,
        props: { className: 'slot-component-belowContentTitle' },
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toHaveClass('slot-component-aboveContentTitle');
    const asideSlot = container.querySelector('aside');
    expect(asideSlot).toBe(null);
  });
  test('renders a SlotRenderer component for the aboveContentTitle and belowContentTitle with different paths, only renders the appropiate one', () => {
    slots.aboveContentTitle = [
      {
        path: '/other-place',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component-aboveContentTitle' },
      },
    ];
    slots.belowContentTitle = [
      {
        path: '/',
        component: (props) => <aside {...props} />,
        props: { className: 'slot-component-belowContentTitle' },
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/other-place' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toHaveClass('slot-component-aboveContentTitle');
    const asideSlot = container.querySelector('aside');
    expect(asideSlot).toBe(null);
  });
  test('renders a SlotRenderer component for the aboveContentTitle with inheritance', () => {
    slots.aboveContentTitle = [
      {
        path: '/other-place',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component-aboveContentTitle' },
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/other-place/other-dir' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toHaveClass('slot-component-aboveContentTitle');
  });
  test('renders a SlotRenderer component for the aboveContentTitle disable inheritance', () => {
    slots.aboveContentTitle = [
      {
        path: '/other-place',
        component: (props) => <div {...props} />,
        props: { className: 'slot-component-aboveContentTitle' },
        exact: true,
      },
    ];

    const { container } = render(
      <MemoryRouter initialEntries={[{ pathname: '/other-place/other-dir' }]}>
        <SlotRenderer name="aboveContentTitle" />
      </MemoryRouter>,
    );
    const divSlot = container.querySelector('div');
    expect(divSlot).toBe(null);
  });
});
