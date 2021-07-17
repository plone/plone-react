import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import LinkView from './LinkView';

test('renders a link view component', () => {
  const component = renderer.create(
    <MemoryRouter>
      <LinkView
        userLoggedIn={true}
        content={{
          title: 'Hello World!',
          description: 'Hi',
          remoteUrl: '/news',
        }}
      />
    </MemoryRouter>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
