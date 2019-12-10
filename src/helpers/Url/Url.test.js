import { settings } from '~/config';

import {
  flattenToAppURL,
  getBaseUrl,
  getIcon,
  getView,
  isExternalLink,
} from './Url';

describe('Url', () => {
  describe('getBaseUrl', () => {
    it('can remove a view name from an absolute url', () => {
      expect(getBaseUrl('http://localhost/edit')).toBe('http://localhost');
    });
    it('can remove a view name from a relative url', () => {
      expect(getBaseUrl('/contents')).toBe('');
    });
    it('can remove a view name from a controlpanel url', () => {
      expect(getBaseUrl('/controlpanel/date-time')).toBe('');
    });
  });

  describe('getView', () => {
    it('can get the edit view from the url', () => {
      expect(getView('http://localhost/edit')).toBe('edit');
    });

    it('can get the view view from the url', () => {
      expect(getView('http://localhost/my-blog')).toBe('view');
    });
  });

  describe('getIcon', () => {
    it('returns an icon for a document', () => {
      expect(getIcon('Document', false)).toBe('file text outline');
    });

    it('returns an icon for an image', () => {
      expect(getIcon('Image', false)).toBe('file image outline');
    });

    it('returns an icon for a file', () => {
      expect(getIcon('File', false)).toBe('attach');
    });

    it('returns an icon for a link', () => {
      expect(getIcon('Link', false)).toBe('linkify');
    });

    it('returns an icon for an event', () => {
      expect(getIcon('Event', false)).toBe('calendar');
    });

    it('returns an icon for a folderish item', () => {
      expect(getIcon('Custom', true)).toBe('folder open outline');
    });

    it('returns an icon for a non folderish item', () => {
      expect(getIcon('Custom', false)).toBe('file outline');
    });
  });

  describe('flattenToAppURL', () => {
    it('flattens a given URL to the app URL', () => {
      expect(flattenToAppURL(`${settings.apiPath}/edit`)).toBe('/edit');
    });
  });
  describe.only('isExternalLink', () => {
    it('flattens a given URL to the app URL', () => {
      expect(isExternalLink('/news')).toBe(false);
      expect(isExternalLink('https://github.com')).toBe(true);
    });
  });
});
