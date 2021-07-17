/**
 * Actions reducer.
 * @module reducers/actions/actions
 */

import { LIST_ACTIONS } from '@plone/volto/constants/ActionTypes';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

const initialState = {
  error: null,
  actions: {
    object: [],
    object_buttons: [],
    site_actions: [],
    user: [],
    document_actions: [],
    portal_tabs: [],
  },
  loaded: false,
  loading: false,
};
initialState.actionsById = arrayWIdsToObject(initialState.actions);

/**
 * Actions reducer.
 * @function actions
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function actions(state = initialState, action = {}) {
  switch (action.type) {
    case `${LIST_ACTIONS}_PENDING`:
      return {
        ...state,
        error: null,
        loaded: false,
        loading: true,
      };
    case `${LIST_ACTIONS}_SUCCESS`:
      return {
        ...state,
        /* Also transform the arrays of actions into objects of actions by action id.
         * Makes it much easier to check for the presence of an action. */
        error: null,
        actions: action.result,
        actionsById: arrayWIdsToObject(action.result),
        loaded: true,
        loading: false,
      };
    case `${LIST_ACTIONS}_FAIL`:
      return {
        ...state,
        error: action.error,
        actions: {},
        loaded: false,
        loading: false,
      };
    default:
      return state;
  }
}
