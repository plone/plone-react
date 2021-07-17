import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

/**
 * Get src-set list from image
 * @param {object | string} image - Image content object or url
 * @param {object} options - { maxSize [number]: maximum size to render, useOriginal [boolean]: whether to render original img }
 */
export const getImageAttributes = (
  image,
  { maxSize = 10000, useOriginal = false } = {},
) => {
  const imageScales = config.settings.imageScales;
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
      let sortedScales = Object.values(image.scales)
        .filter((scale) => scale.width <= maxSize)
        .filter((scale) => scale.width < image.width) // avoid duplicates if image is small and original is smaller than scale
        .sort((a, b) => {
          if (a.width > b.width) return 1;
          else if (a.width < b.width) return -1;
          else return 0;
        });
      attrs.src = sortedScales[0].download;
      attrs.srcSet = sortedScales.map(
        (scale) => `${flattenToAppURL(scale.download)} ${scale.width}w`,
      );

      if (useOriginal)
        attrs.srcSet = attrs.srcSet.concat(
          `${flattenToAppURL(image.download)} ${image.width}w`,
        );
      break;

    // Internal URL
    case 'internalUrl':
      let baseUrl = `${flattenToAppURL(image.split('/@@images')[0])}${
        image.endsWith('/') ? '' : '/'
      }@@images/image`;
      attrs.src = `${baseUrl}/${minSize}`;
      attrs.srcSet = Object.keys(imageScales).reduce((srcSet, scale) => {
        return [...srcSet, `${baseUrl}/${scale} ${imageScales[scale]}w`];
      }, []);

      if (useOriginal) attrs.srcSet = attrs.srcSet.concat(`${baseUrl} 1200w`); // expect that is for desktop screens, I don't have actual size
      break;

    // External URL or other element
    default:
      attrs.src = typeof image === 'string' ? image : null;
      break;
  }

  return attrs;
};
