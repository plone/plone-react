import authRole from './authRole';
import { AUTH_ROLE } from '@plone/volto/constants/ActionTypes';

describe('AuthRole reducer', () => {
  it('should return the initial state', () => {
    expect(authRole()).toEqual({
      authenticatedRole: null,
    });
  });

  it('should update the authRole', () => {
    expect(
      authRole(undefined, {
        type: AUTH_ROLE,
      }),
    ).toMatchObject({
      authenticatedRole: undefined,
    });
  });
});
