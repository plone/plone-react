import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import Header from './Header';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

const mockStore = configureStore();

jest.mock('../Logo/Logo', () => jest.fn(() => <div id="logo" />));
jest.mock('../SearchWidget/SearchWidget', () =>
  jest.fn(() => <div id="searchwidget" />),
);
jest.mock('../Anontools/Anontools', () =>
  jest.fn(() => <div id="anontools" />),
);
jest.mock('../Navigation/Navigation', () =>
  jest.fn(() => <div id="navigation" />),
);
jest.mock('../LanguageSelector/LanguageSelector', () =>
  jest.fn(() => <div id="language-selector" />),
);

const actions = { user: [{ id: 'login' }] };
const actionsById = arrayWIdsToObject(actions);

describe('Header', () => {
  it('renders a header component', () => {
    const store = mockStore({
      actions: { actions, actionsById },
      intl: {
        locale: 'en',
        messages: {},
      },
    });

    const component = renderer.create(
      <Provider store={store}>
        <Header pathname="/blog" />
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
