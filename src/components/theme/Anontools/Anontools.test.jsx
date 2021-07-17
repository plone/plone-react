import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';

import Anontools from './Anontools';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

const mockStore = configureStore();

const actions = { user: [{ id: 'login' }] };
const actionsById = arrayWIdsToObject(actions);

describe('Anontools', () => {
  it('renders an anontools component when no use is logged in', () => {
    const store = mockStore({
      actions: { actions, actionsById },
      content: { data: { '@id': 'myid' } },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Anontools />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('should not render an anontools component when a user is logged in', () => {
    const actions = { user: [{ id: 'logout' }] };
    const store = mockStore({
      actions: { actions, actionsById: arrayWIdsToObject(actions) },
      content: { data: {} },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Anontools />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
