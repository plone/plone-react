import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';

import ImageView from './ImageView';

import config from '@plone/volto/registry';

config.settings.imageScales = {
  large: 768,
  preview: 400,
  mini: 200,
  thumb: 128,
  tile: 64,
  icon: 32,
  listing: 16,
};

const mockStore = configureStore();

test('renders an image view component', () => {
  const store = mockStore({
    intl: {
      locale: 'en',
      messages: {},
    },
  });
  const component = renderer.create(
    <Provider store={store}>
      <ImageView
        content={{
          title: 'Hello World!',
          description: 'Hi',
          image: {
            download: 'http://localhost:8080/Plone/test-images/@@images/image',
            size: 123123,
            width: 1920,
            scales: {
              icon: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/icon',
                width: 32,
              },
              large: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/large',
                width: 768,
              },
              listing: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/listing',
                width: 16,
              },
              mini: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/mini',
                width: 200,
              },
              preview: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/preview',
                width: 400,
              },
              thumb: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/thumb',
                width: 128,
              },
              tile: {
                download:
                  'http://localhost:8080/Plone/test-images/@@images/image/tile',
                width: 64,
              },
            },
          },
        }}
      />
    </Provider>,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
