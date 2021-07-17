/**
 * Point of contact for helper modules.
 * @module helpers
 * @example import { Api, Html } from 'helpers';
 */

// export { injectLazyLibs } from './Loadable/Loadable';
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
  toPublicURL,
  isInternalURL,
  getParentUrl,
  getBaseUrl,
  getView,
  isCmsUi,
  getId,
  isUrl,
  normalizeUrl,
  removeProtocol,
} from '@plone/volto/helpers/Url/Url';
export { generateSitemap } from '@plone/volto/helpers/Sitemap/Sitemap';
export { generateRobots } from '@plone/volto/helpers/Robots/Robots';
export {
  nestContent,
  getLayoutFieldname,
  getContentIcon,
} from '@plone/volto/helpers/Content/Content';
export {
  addBlock,
  insertBlock,
  blockHasValue,
  changeBlock,
  deleteBlock,
  emptyBlocksForm,
  getBlocks,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
  moveBlock,
  mutateBlock,
  nextBlockId,
  previousBlockId,
} from '@plone/volto/helpers/Blocks/Blocks';
export BodyClass from '@plone/volto/helpers/BodyClass/BodyClass';
export ScrollToTop from '@plone/volto/helpers/ScrollToTop/ScrollToTop';
export {
  getBoolean,
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
  getFieldsVocabulary,
} from '@plone/volto/helpers/Vocabularies/Vocabularies';

export langmap from './LanguageMap/LanguageMap';
export Helmet from './Helmet/Helmet';
export FormValidation from './FormValidation/FormValidation';
export {
  difference,
  getColor,
  getInitials,
  safeWrapper,
  applyConfig,
  withServerErrorCode,
  parseDateTime,
  normalizeLanguageName,
  hasApiExpander,
} from '@plone/volto/helpers/Utils/Utils';

export { getImageAttributes } from './Image/Image';
export { messages } from './MessageLabels/MessageLabels';
export {
  withBlockSchemaEnhancer,
  withVariationSchemaEnhancer,
  withBlockExtensions,
} from './Extensions';
export { asyncConnect } from './AsyncConnect';
export { userHasRoles } from './User/User';
// export { injectLazyLibs } from './Loadable/Loadable';
export { useDetectClickOutside } from './Utils/useDetectClickOutside';
