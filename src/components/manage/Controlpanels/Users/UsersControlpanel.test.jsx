import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import UsersControlpanel from './UsersControlpanel';

const mockStore = configureStore();
jest.mock('react-portal', () => ({
  Portal: jest.fn(() => <div id="Portal" />),
}));
describe('UsersControlpanel', () => {
  it('renders a user control component', () => {
    const store = mockStore({
      roles: { roles: [] },
      users: {
        users: [],
        create: { loading: false },
      },
      groups: {
        groups: [],
        create: { loading: false },
      },
      authRole: {
        authenticatedRole: [],
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <UsersControlpanel location={{ pathname: '/blog' }} />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
