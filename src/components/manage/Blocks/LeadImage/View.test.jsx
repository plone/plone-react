import React from 'react';
import renderer from 'react-test-renderer';
import View from './View';

test('renders a view image component', () => {
  const component = renderer.create(
    <View
      data={{}}
      properties={{
        image: {
          download: 'http://localhost:8080/Plone/test-images/@@images/image',
          width: 1920,
          scales: {
            listing: {
              download:
                'http://localhost:8080/Plone/test-images/@@images/image/listing',
              width: 16,
            },
            icon: {
              download:
                'http://localhost:8080/Plone/test-images/@@images/image/icon',
              width: 32,
            },
            tile: {
              download:
                'http://localhost:8080/Plone/test-images/@@images/image/tile',
              width: 64,
            },
            thumb: {
              download:
                'http://localhost:8080/Plone/test-images/@@images/image/thumb',
              width: 128,
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
            large: {
              download:
                'http://localhost:8080/Plone/test-images/@@images/image/large',
              width: 768,
            },
          },
        },
      }}
    />,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
