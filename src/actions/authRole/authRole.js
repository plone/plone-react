/**
 * AuthRole actions.
 * @module actions/authRole/authRole
 */

import { AUTH_ROLE } from '@plone/volto/constants/ActionTypes';

export function authenticatedRole(role) {
  return {
    type: AUTH_ROLE,
    result: role,
  };
}
