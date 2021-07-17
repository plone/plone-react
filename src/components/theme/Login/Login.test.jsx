import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import config from '@plone/volto/registry';

import Login from './Login';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

beforeAll(() => {
  config.settings.nonContentRoutes = [];
  config.settings.navDepth = 1;
});

const mockStore = configureStore();

const actions = { user: [{ id: 'login' }] };
const actionsById = arrayWIdsToObject(actions);

describe('Login', () => {
  it('renders a login component', () => {
    const store = mockStore({
      actions: { actions, actionsById },
      userSession: {
        login: {},
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <MemoryRouter>
          <Login location={{ search: {} }} />
        </MemoryRouter>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
