/**
 * Point of contact for helper modules.
 * @module helpers
 * @example import { Api, Html } from 'helpers';
 */

export Api from '@plone/volto/helpers/Api/Api';
export { getAPIResourceWithAuth } from '@plone/volto/helpers/Api/APIResourceWithAuth';
export Html from '@plone/volto/helpers/Html/Html';
export {
  getAuthToken,
  persistAuthToken,
} from '@plone/volto/helpers/AuthToken/AuthToken';
export {
  addAppURL,
  flattenHTMLToAppURL,
  flattenToAppURL,
  isInternalURL,
  getBaseUrl,
  getIcon,
  getView,
} from '@plone/volto/helpers/Url/Url';
export { generateSitemap } from '@plone/volto/helpers/Sitemap/Sitemap';
export {
  nestContent,
  getLayoutFieldname,
} from '@plone/volto/helpers/Content/Content';
export {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers/Blocks/Blocks';
export BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
export ScrollToTop from '@plone/volto/helpers/ScrollToTop/ScrollToTop';
export AnimationWrapper from '@plone/volto/helpers/AnimationWrapper/AnimationWrapper';
export {
  getBoolean,
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers/Vocabularies/Vocabularies';
export AlignBlock from '@plone/volto/helpers/AlignBlock/AlignBlock';

export Helmet from './Helmet/Helmet';
export { difference } from '@plone/volto/helpers/Utils/Utils';
