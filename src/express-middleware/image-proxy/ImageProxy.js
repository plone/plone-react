import sharp from 'sharp';
import superagent from 'superagent';
import { getAPIResourceWithAuth } from '@plone/volto/helpers';
import { getLogger } from '@plone/volto/express-middleware/logger';
import { settings } from '~/config';

const debug = getLogger('image-proxy');

const HEADERS = ['content-disposition', 'cache-control']; // 'content-type'

const NONLOSSY = ['png', 'gif', 'tif'];

const FORMATS = {
  jpeg: 'jpg',
  tiff: 'tif',
};

function extractFormat(format) {
  const sufix = format.replace('image/', '');
  return FORMATS[sufix] || sufix;
}

function etag(headers) {
  const etag = (headers.etag || headers['last-modified'] || headers.date || '')
    .toLowerCase()
    .replace(/\s/g, '-');
  return etag;
}

/**
 * @class ImageProxy
 *
 * A utility object to deal with data fetching, cache storing and conversions
 *
 * - two caches:
 *   - ProcessedCache, for thumbnails and optimized images
 *   - UnprocessedCache, for unprocessed originals (no thumbnails)
 *
 * - image fetching layer ->
 *    -> get context full URL
 *    -> connect to backend, check last-modified HEAD
 *        -> use it to create cache keys:
 *          - original (in UnprocessedCache)
 *          - thumbnail/optimized (in ProcessedCache)
 *    -> is it a thumbnail?
 *        -> fetch from thumbnail cache
 *          -> is it in ProcessedCache?
 *            -> return data
 *          -> do we have original data in UnprocessedCache?
 *            -> compute thumbnail
 *            -> store it in ProcessedCache
 *            -> return data
 *    -> it's not a thumbnail
 *        -> fetch from ProcessedCache
 *          -> it is in cache?
 *            -> return data
 *          -> it's not in cache
 *            -> fetch original from backend
 *            -> store original in UnprocessedCache
 *            -> convert/optimize original
 *            - store it in ProcessedCache
 *            -> return data
 *
 */
export default class ImageProxy {
  constructor(request, cache, errorHandler) {
    const { path } = request;
    let [contextUrl, imageName] = path.split('/@@images/');
    const [fieldName = '', thumbSize = ''] = imageName.split('/');
    const fullImagePath = `${contextUrl}/@@images/${fieldName}`;

    if (thumbSize.includes('/')) {
      debug('Unknown thumbnail size');
    }

    this.request = request;
    this.fieldName = fieldName;
    this.imageName = imageName;
    this.path = path;
    this.thumbSize = thumbSize;
    this.fullImagePath = fullImagePath;
    this.contextUrl = contextUrl;
    this.metadata = {};
    this.cache = cache;
  }

  isThumbnail() {
    return !!this.thumbSize;
  }

  async syncMetadataFromBackend() {
    const { apiPath } = settings;
    const response = await superagent.head(`${apiPath}${this.contextUrl}`);
    this.metadata = response.headers;
  }

  async getFromProcessedCache() {
    const key = this.cacheKey();
    debug(`cache.processed - get: ${key}`);
    return await this.cache.processed.get(this.cacheKey());
  }

  async getFromUnprocessedCache() {
    const key = this.cacheKeyOriginal();
    debug(`cache.unprocessed - get: ${key}`);
    return await this.cache.unprocessed.get(key);
  }

  async fetchOriginalFromBackend() {
    debug(`Fetching original at: ${this.fullImagePath}`);
    const req = { path: this.fullImagePath };
    const { body, headers } = await getAPIResourceWithAuth(req);

    // {
    //  'accept-ranges': 'none',
    //    connection: 'close',                                                                                                                                                    'content-length': '7684296',
    //    'content-type': 'image/png',
    //    date: 'Sun, 24 Jan 2021 17:43:49 GMT',
    //    etag: 'ts11398123.3865113',
    //    'last-modified': 'Sat, 23 Jan 2021 10:35:23 GMT',
    //    server: 'waitress',
    //    via: 'waitress',
    //    'x-powered-by': 'Zope (www.zope.org), Python (www.python.org)'
    // }

    const container = {
      data: body,
      format: extractFormat(headers['content-type']),
      headers: Object.assign({}, ...HEADERS.map((h) => ({ [h]: headers[h] }))),
    };

    const cacheKey = this.cacheKeyOriginal();

    debug(`cache.unprocessed - store: ${cacheKey}`);
    this.cache.unprocessed.set(cacheKey, container);

    return container;
  }

  async convertOriginal(original) {
    const { data, format } = original;
    const res = await this.convert(data.data ?? data, format);

    // info: {
    //   format: 'webp',
    //     width: 3373,
    //     height: 1897,
    //     channels: 3,
    //     premultiplied: false,
    //     size: 618278
    // }

    const converted = {
      data: res.data,
      format: res.info.format,
      size: res.info.size,
      headers: original.headers,
    };

    const cacheKey = this.cacheKey();

    debug(`cache.processed - store converted original: ${cacheKey}`);
    this.cache.processed.set(cacheKey, converted);

    return converted;
  }

  async resizeOriginal(original) {
    const { imageScales } = settings;

    const width = imageScales[this.thumbSize];
    const { data, format, headers } = original;
    const res = await this.convert(data.data ?? data, format, undefined, width);

    const converted = {
      data: res.data,
      format: res.info.format,
      size: res.info.size,
      headers,
    };

    const cacheKey = this.cacheKey();
    debug(`cache.processed - store resized: ${cacheKey}`);
    this.cache.processed.set(cacheKey, converted);

    return converted;
  }

  async getData() {
    await this.syncMetadataFromBackend();

    // container is like { format: 'image/jpeg', data: Buffer(), size: 123 };
    let container, original;

    container = await this.getFromProcessedCache();

    if (container) {
      debug(`cache.processed - found: ${this.cacheKey()}`);
      return container;
    }

    debug(`cache.processed - not found: ${this.cacheKey()}`);

    original = await this.getFromUnprocessedCache();

    if (!original) {
      original = await this.fetchOriginalFromBackend();
    } else {
      debug(`cache.unprocessed - found: ${this.cacheKeyOriginal()}`);
    }

    container = this.isThumbnail()
      ? await this.resizeOriginal(original)
      : NONLOSSY.includes(extractFormat(original.format))
      ? original
      : await this.convertOriginal(original);

    return container;
  }

  convert(dataStream, toFormat = 'webp', quality = 80, resizeTo) {
    // Possible formats: heif // avif // jpeg
    return new Promise((resolve, reject) => {
      const pipeline = sharp(Buffer.from(dataStream));

      pipeline.toFormat(toFormat, {
        quality,
      });

      if (resizeTo) {
        pipeline.resize({ width: resizeTo });
      }

      pipeline.toBuffer((err, data, info) => {
        if (err) {
          reject(err);
        } else {
          debug('Processing image convert/resize pipeline...');
          resolve({ data, info });
        }
      });
    });
  }

  cacheKey() {
    return `${this.path}-${etag(this.metadata)}`;
  }

  cacheKeyOriginal() {
    return `${this.fullImagePath}-${etag(this.metadata)}`;
  }
}
