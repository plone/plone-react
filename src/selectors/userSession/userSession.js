/**
 * Authenticated user state selectors.
 * @module selectors/userSession/userSession
 */

import jwtDecode from 'jwt-decode';

/**
 * Is a user logged in selector
 * @function loggedIn
 * @param {Object} state Current full Redux store state.
 * @returns {boolean} `true` if a user is currently authenticated, `false` otherwise.
 */
export function loggedIn(state) {
  /* The user may be authenticated by different means, including outside the UI.  Defer
   * to the response from Plone, sepcifically whether Plone presents an option to log
   * in. */
  return !state.actions.actionsById.user.login;
}

/**
 * Retreive user data for the currently authenticated user
 * @function userData
 * @param {Object} state Current full Redux store state.
 * @returns {Object} An object with properties for each user data
 */
export function userData(state) {
  return {
    userId: state.userSession.token
      ? jwtDecode(state.userSession.token).sub
      : '',
  };
}
