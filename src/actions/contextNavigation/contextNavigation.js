/**
 * Navigation actions.
 * @module actions/contextNavigation/contextNavigation
 */

import { GET_CONTEXT_NAVIGATION } from '@plone/volto/constants/ActionTypes';
import { contextNavPath } from '@plone/volto/helpers/ContextNavigation';

/**
 * Get the context navigation
 * @function getContextNavigation
 * @param {string} url Content url.
 * @param {params} params Options for the navigation component
 * @returns {Object} Get context navigation action
 */
export function getContextNavigation(url, params = {}) {
  const path = contextNavPath(url, params);

  return {
    type: GET_CONTEXT_NAVIGATION,
    url: path, // api middleware strips request
    request: {
      op: 'get',
      path,
    },
  };
}
