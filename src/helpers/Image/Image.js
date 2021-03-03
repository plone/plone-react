import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import { settings } from '~/config';

/**
 * Get src-set list from image
 * @param {object | string} image - Image content object or url
 */
export const getImageAttributes = (image) => {
  const imageScales = settings.imageScales;
  const minSize = Object.keys(imageScales).reduce((minSize, scale) => {
    if (!minSize || imageScales[scale] < imageScales[minSize]) {
      return scale;
    }

    return minSize;
  }, null);

  let attrs = {};
  let imageType =
    Object.prototype.toString.call(image) === '[object Object]' &&
    image.scales &&
    Object.keys(image.scales).length > 0
      ? 'imageObject'
      : typeof image === 'string' && isInternalURL(image)
      ? 'internalUrl'
      : 'external';

  switch (imageType) {
    // Scales object from Plone restapi
    // ideal use of Plone images
    case 'imageObject':
      let sortedScales = Object.values(image.scales).sort(
        (a, b) => a.width - b.width,
      );
      attrs.src = sortedScales[0].download;
      attrs.srcSet = sortedScales
        .map((scale) => `${flattenToAppURL(scale.download)} ${scale.width}w`)
        .concat(`${flattenToAppURL(image.download)} ${image.width}w`);
      break;

    // Internal URL
    case 'internalUrl':
      let baseUrl = `${flattenToAppURL(image.split('/@@images')[0])}${
        image.endsWith('/') ? '' : '/'
      }@@images/image`;
      attrs.src = `${baseUrl}/${minSize}`;
      attrs.srcSet = Object.keys(imageScales)
        .reduce((srcSet, scale) => {
          return [...srcSet, `${baseUrl}/${scale} ${imageScales[scale]}w`];
        }, [])
        .concat(`${baseUrl} 1200w`); // expect that is for desktop screens, I don't have actual size
      break;

    // External URL or other element
    default:
      attrs.src = typeof image === 'string' ? image : null;
      break;
  }

  return attrs;
};
