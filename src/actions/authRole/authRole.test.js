import { AUTH_ROLE } from '@plone/volto/constants/ActionTypes';
import { authenticatedRole } from './authRole';

describe('AuthRole action', () => {
  it('should update the authenticated Role', () => {
    const role = 'Editor';
    const action = authenticatedRole(role);
    expect(action.type).toEqual(AUTH_ROLE);
    expect(action.result).toEqual(role);
  });
});
