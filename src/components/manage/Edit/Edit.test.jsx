import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';
import { __test__ as Edit } from './Edit';

const mockStore = configureStore();

jest.mock('react-portal', () => ({
  Portal: jest.fn(() => <div id="Portal" />),
}));
jest.mock('../Form/Form', () => jest.fn(() => <div className="Form" />));

const actions = {
  document_actions: [],
  object: [
    {
      icon: '',
      id: 'edit',
      title: 'Edit',
    },
  ],
  user: [{ id: 'logout' }],
};
const actionsById = arrayWIdsToObject(actions);

describe('Edit', () => {
  it('renders an empty edit component', () => {
    const store = mockStore({
      actions: { actions, actionsById },
      schema: {
        schema: null,
      },
      content: {
        data: null,
        get: {
          loading: false,
          loaded: true,
        },
        update: {
          loading: false,
          loaded: true,
        },
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <Edit location={{ pathname: '/blog', search: {} }} />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders an edit component', () => {
    const store = mockStore({
      actions: { actions, actionsById },
      schema: {
        schema: {
          some: 'field',
        },
      },
      content: {
        data: {},
        get: {
          loading: false,
          loaded: true,
        },
        update: {
          loading: false,
          loaded: true,
        },
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <Edit location={{ pathname: '/blog', search: {} }} />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
