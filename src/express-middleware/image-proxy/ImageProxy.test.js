import React from 'react';
import superagent from 'superagent';
import ImageProxy from '@plone/volto/express-middleware/image-proxy/ImageProxy.js';
import * as helpers from '@plone/volto/helpers';
import sharp from 'sharp';

jest.mock('superagent');
jest.mock('sharp');
jest.mock('@plone/volto/helpers');

const pipeline = {
  toFormat: jest.fn(),
  resize: jest.fn(),
  toBuffer: jest.fn((cb) => cb(null, 'some data', { format: 'png' })),
};

const mockCache = {
  processed: {
    get(key) {
      return new Promise((resolve) => resolve('from processed'));
    },
    set(key, value) {
      this._k = key;
      this._v = value;
    },
  },
  unprocessed: {
    set(key, value) {
      this._k = key;
      this._v = value;
    },
    get(key) {
      return new Promise((resolve) => resolve('from unprocessed'));
    },
  },
};

sharp.mockImplementation(function (dataStream) {
  return pipeline;
});

jest.mock('~/config', () => ({
  settings: {
    nonContentRoutes: [],
    supportedLanguages: ['en'],
    navDepth: 1,
  },
  views: {
    errorViews: {
      ECONNREFUSED: () => <div className="ECONNREFUSED" />,
    },
  },
}));

describe('Images fetched from backend are represented by the ImageProxy class', () => {
  it('Is constructed from a request with an image path', () => {
    expect(() => {
      new ImageProxy({ path: '/a/b' });
    }).toThrow(new TypeError("Cannot read property 'split' of undefined"));

    const img = new ImageProxy({ path: '/a/@@images/image' });

    expect(img.path).toBe('/a/@@images/image');
    expect(img.fieldName).toBe('image');
    expect(img.thumbSize).toBe('');
    expect(img.contextUrl).toBe('/a');
    expect(img.fullImagePath).toBe('/a/@@images/image');
  });

  it('Can handle thumbnail paths', () => {
    const img = new ImageProxy({ path: '/a/@@images/image/mini' });

    expect(img.path).toBe('/a/@@images/image/mini');
    expect(img.fieldName).toBe('image');
    expect(img.thumbSize).toBe('mini');
    expect(img.contextUrl).toBe('/a');
    expect(img.fullImagePath).toBe('/a/@@images/image');
  });

  it('Can handle any image field', () => {
    const img = new ImageProxy({ path: '/a/@@images/logo/mini' });

    expect(img.path).toBe('/a/@@images/logo/mini');
    expect(img.thumbSize).toBe('mini');
    expect(img.fieldName).toBe('logo');
    expect(img.contextUrl).toBe('/a');
    expect(img.fullImagePath).toBe('/a/@@images/logo');
  });

  it('Computes a cacheKey for the provided URL', () => {
    const img = new ImageProxy({ path: '/a/@@images/logo/mini' });
    img.metadata['last-modified'] = '-timestamp-';

    expect(img.cacheKey()).toBe('/a/@@images/logo/mini--timestamp-');
  });

  it('Computes a cacheKey for the original field URL', () => {
    const img = new ImageProxy({ path: '/a/@@images/logo/mini' });
    img.metadata['last-modified'] = '-timestamp-';

    expect(img.cacheKeyOriginal()).toBe('/a/@@images/logo--timestamp-');
  });

  it('It knows if the image is a resize', () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' });
    expect(img.isThumbnail()).toBe(true);

    img = new ImageProxy({ path: '/a/@@images/logo' });
    expect(img.isThumbnail()).toBe(false);
  });

  it('Fetches metadata with a HEAD call', async () => {
    const resp = { headers: { 'last-modified': 1, eta: 2 } };
    superagent.head.mockResolvedValue(resp);

    let img = new ImageProxy({ path: '/a/@@images/logo/mini' });
    await img.syncMetadataFromBackend();

    expect(img.metadata).toEqual(resp.headers);
  });

  it('Fetches holds references to a cache', () => {
    const cache = { processed: {}, unprocessed: {} };

    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, cache);

    expect(img.cache).toEqual(cache);
  });

  it('Gets data from caches', async () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, mockCache);

    expect(await img.getFromProcessedCache()).toEqual('from processed');
    expect(await img.getFromUnprocessedCache()).toEqual('from unprocessed');
  });

  it('Can fetch an original image from backend', async () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, mockCache);

    const resp = {
      body: 'body',
      headers: {
        'content-type': 'image/png',
        'last-modified': '1',
        etag: '2',
      },
    };
    helpers.getAPIResourceWithAuth.mockResolvedValue(resp);
    const container = await img.fetchOriginalFromBackend();
    expect(container).toEqual({
      data: 'body',
      format: 'png',
      headers: { 'content-disposition': undefined, 'cache-control': undefined },
    });
  });

  it('Can run conversion on data', async () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, {});
    const res = await img.convert('data');
    expect(pipeline.toBuffer).toHaveBeenCalled();
    expect(pipeline.resize).not.toHaveBeenCalled();
    expect(res).toEqual({
      data: 'some data',
      info: { format: 'png' },
    });
  });

  it('Can do resize conversion on data', async () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, {});
    const res = await img.convert('data', 'png', 80, 120);
    expect(pipeline.toBuffer).toHaveBeenCalled();
    expect(pipeline.resize).toHaveBeenCalledWith({ width: 120 });
    expect(res).toEqual({
      data: 'some data',
      info: { format: 'png' },
    });
  });

  it('Provides data-conversion, storage and retrieval', async () => {
    let img = new ImageProxy({ path: '/a/@@images/logo/mini' }, mockCache);
    img.syncMetadataFromBackend = async () => {
      img.metadata = {
        format: 'image/png',
        etag: 'ts1234',
        'last-modified': '1979-01-01',
      };
    };

    const data = await img.getData();
    expect(data).toBe('from processed');
  });
});
