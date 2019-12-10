import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Link from './Link';

describe('Link', () => {
  it('renders a Link component', () => {
    const component = renderer.create(
      <MemoryRouter>
        <Link />
      </MemoryRouter>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
