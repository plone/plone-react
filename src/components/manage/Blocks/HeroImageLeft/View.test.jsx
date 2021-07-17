import React from 'react';
import renderer from 'react-test-renderer';
import View from './View';

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

test('renders a view hero component', () => {
  const component = renderer.create(
    <View data={{ url: 'http://localhost:8080/Plone/heroimage.jpg' }} />,
  );
  const json = component.toJSON();
  expect(json).toMatchSnapshot();
});
