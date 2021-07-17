import React from 'react';
import renderer from 'react-test-renderer';
import Image from './Image';

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

const ploneImage = {
  download: 'http://localhost:8080/Plone/test-images/@@images/image',
  width: 1920,
  scales: {
    icon: {
      download: 'http://localhost:8080/Plone/test-images/@@images/image/icon',
      width: 32,
    },
    large: {
      download: 'http://localhost:8080/Plone/test-images/@@images/image/large',
      width: 768,
    },
    listing: {
      download:
        'http://localhost:8080/Plone/test-images/@@images/image/listing',
      width: 16,
    },
    mini: {
      download: 'http://localhost:8080/Plone/test-images/@@images/image/mini',
      width: 200,
    },
    preview: {
      download:
        'http://localhost:8080/Plone/test-images/@@images/image/preview',
      width: 400,
    },
    thumb: {
      download: 'http://localhost:8080/Plone/test-images/@@images/image/thumb',
      width: 128,
    },
    tile: {
      download: 'http://localhost:8080/Plone/test-images/@@images/image/tile',
      width: 64,
    },
  },
};

describe('Image', () => {
  it('renders image with default values and image url', () => {
    const component = renderer.create(
      <Image image="http://localhost:8080/Plone/photo.png" />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders image with props and image url', () => {
    const component = renderer.create(
      <Image
        image="http://localhost:8080/Plone/photo.png"
        alt="Photo"
        className="photo-image"
        role="presentation"
      />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders image with plone image object', () => {
    const component = renderer.create(
      <Image
        image={ploneImage}
        alt="Photo"
        className="photo-image"
        role="presentation"
      />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders image with external url', () => {
    const component = renderer.create(
      <Image
        image="https://picsum.photos/200/300"
        alt="External picsum photo"
      />,
    );

    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders image with plone image object and opt props', () => {
    const component = renderer.create(
      <Image
        image={ploneImage}
        alt="Photo"
        className="photo-image"
        role="presentation"
        maxSize={200}
      />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });

  it('renders image with plone image object and original', () => {
    const component = renderer.create(
      <Image
        image={ploneImage}
        alt="Photo"
        className="photo-image"
        role="presentation"
        useOriginal
      />,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
