import { AUTH_ROLE } from '@plone/volto/constants/ActionTypes';

const initialState = {
  authenticatedRole: null,
};

/**  storing the authRole state
 * authRole reducer.
 * @function authRole
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function authRole(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_ROLE:
      return {
        ...state,
        authenticatedRole: action.result,
      };
    default:
      return state;
  }
}
