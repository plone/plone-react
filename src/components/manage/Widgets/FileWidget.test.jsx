import React from 'react';
import { waitFor } from '@testing-library/react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import FileWidget from './FileWidget';
import { Provider } from 'react-intl-redux';

const mockStore = configureStore();

test('renders a file widget component', async () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });

  const component = renderer.create(
    <Provider store={store}>
      <FileWidget id="my-field" title="My field" onChange={() => {}} />,
    </Provider>,
  );

  await waitFor(() => {});
  expect(component.toJSON()).toMatchSnapshot();
});
