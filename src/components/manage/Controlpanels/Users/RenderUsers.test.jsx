import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import RenderUsers from './RenderUsers';

const mockStore = configureStore();

const testUser = {
  '@id': 'http://localhost:8080/Plone/@users/testuser',
  description: '',
  email: 'testuser@plone.org',
  fullname: 'Test User',
  home_page: 'http://plone.org',
  id: 'testuser',
  location: 'somewhere',
  roles: ['Member'],
  username: 'testuser',
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

describe('UsersControlpanelUser', () => {
  it('renders a UsersControlpanelUser component', () => {
    const store = mockStore({
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <RenderUsers user={testUser} roles={testRoles} onDelete={() => {}} />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
