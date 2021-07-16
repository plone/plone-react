import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import RenderGroups from './RenderGroups';

const mockStore = configureStore();

const testGroups = {
  '@id': 'http://localhost:55001/plone/@groups/Administrators',
  description: '',
  email: '',
  groupname: 'Administrators',
  id: 'Administrators',
  title: 'Administrators',
  roles: ['Manager'],
};

const testRoles = [
  {
    '@id': 'http://localhost:8080/Plone/@roles/Member',
    '@type': 'role',
    id: 'Member',
  },
  {
    '@id': 'http://localhost:8080/Plone/@roles/Reader',
    '@type': 'role',
    id: 'Reader',
  },
  {
    '@id': 'http://localhost:8080/Plone/@roles/Manager',
    '@type': 'role',
    id: 'Manager',
  },
];

describe('UsersControlpanelGroups', () => {
  it('renders a UsersControlpanelGroups component', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <RenderGroups
          group={testGroups}
          roles={testRoles}
          onDelete={() => {}}
        />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
