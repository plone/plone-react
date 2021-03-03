import debug from 'debug';

export const log = debug('volto');

export function getLogger(ns) {
  return log.extend(ns);
}
