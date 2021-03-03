import Keyv from 'keyv';
import FileCache from './file-cache';
import { settings } from '~/config';
import QuickLRU from './quick-lru';
import { getLogger } from '../logger';

const debug = getLogger('image-proxy:cache');

let _unprocessed = null;
let _processed = null;

export default function get() {
  if (!_unprocessed) {
    debug('Build new cache store instances');

    _unprocessed = new Keyv({
      namespace: 'raw',
      store: new FileCache({
        maxSize: 6,
        basePath: '../public/cache',
      }),
      serialize: (value) => value,
      ...settings.serverConfig.rawImagesCache,
    });

    _processed = new Keyv({
      namespace: 'processed',
      store: new QuickLRU({ maxSize: 10000 }),
      ...settings.serverConfig.processedImagesCache,
    });
  }

  return {
    unprocessed: _unprocessed,
    processed: _processed,
  };
}
