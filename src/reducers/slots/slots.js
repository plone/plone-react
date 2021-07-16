import { GET_SLOTS } from '@plone/volto/constants/ActionTypes';
//, UPDATE_SLOTS

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Context Navigation reducer.
 * @function navigation
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function slots(state = {}, action = {}) {
  let { result } = action;

  switch (action.type) {
    case `${GET_SLOTS}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: undefined,
        },
      };
    case `${GET_SLOTS}_SUCCESS`:
      return {
        ...state,
        data: {
          ...result,
        },
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: undefined,
        },
      };
    case `${GET_SLOTS}_FAIL`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      break;
  }
  return state;
}
