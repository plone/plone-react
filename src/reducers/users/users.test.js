import users from './users';
import {
  CREATE_USER,
  DELETE_USER,
  GET_USER,
  LIST_USERS,
  UPDATE_PASSWORD,
  UPDATE_USER,
  INITIAL_PASSWORD,
  RESET_PASSWORD,
} from '@plone/volto/constants/ActionTypes';

describe('Users reducer', () => {
  it('should return the initial state', () => {
    expect(users()).toEqual({
      user: {},
      users: [],
      create: {
        error: null,
        loaded: false,
        loading: false,
      },
      delete: {
        error: null,
        loaded: false,
        loading: false,
      },
      get: {
        error: null,
        loaded: false,
        loading: false,
      },
      update: {
        error: null,
        loaded: false,
        loading: false,
      },
      update_password: {
        error: null,
        loaded: false,
        loading: false,
      },
      list: {
        error: null,
        loaded: false,
        loading: false,
      },
      password: {
        error: null,
        loaded: false,
        loading: false,
      },
      initial: {
        error: null,
        loaded: false,
        loading: false,
      },
      reset: {
        error: null,
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle CREATE_USER_PENDING', () => {
    expect(
      users(undefined, {
        type: `${CREATE_USER}_PENDING`,
      }),
    ).toMatchObject({
      create: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle CREATE_USER_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${CREATE_USER}_SUCCESS`,
      }),
    ).toMatchObject({
      create: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle CREATE_USER_FAIL', () => {
    expect(
      users(undefined, {
        type: `${CREATE_USER}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      create: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle DELETE_USER_PENDING', () => {
    expect(
      users(undefined, {
        type: `${DELETE_USER}_PENDING`,
      }),
    ).toMatchObject({
      delete: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle DELETE_USER_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${DELETE_USER}_SUCCESS`,
      }),
    ).toMatchObject({
      delete: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle DELETE_USER_FAIL', () => {
    expect(
      users(undefined, {
        type: `${DELETE_USER}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      delete: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle GET_USER_PENDING', () => {
    expect(
      users(undefined, {
        type: `${GET_USER}_PENDING`,
      }),
    ).toMatchObject({
      get: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle GET_USER_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${GET_USER}_SUCCESS`,
        result: 'result',
      }),
    ).toMatchObject({
      user: 'result',
      get: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle GET_USER_FAIL', () => {
    expect(
      users(undefined, {
        type: `${GET_USER}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      user: {},
      get: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle LIST_USERS_PENDING', () => {
    expect(
      users(undefined, {
        type: `${LIST_USERS}_PENDING`,
      }),
    ).toMatchObject({
      list: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle LIST_USERS_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${LIST_USERS}_SUCCESS`,
        result: 'result',
      }),
    ).toMatchObject({
      users: 'result',
      list: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle LIST_USERS_FAIL', () => {
    expect(
      users(undefined, {
        type: `${LIST_USERS}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      users: {},
      list: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle UPDATE_PASSWORD_PENDING', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_PASSWORD}_PENDING`,
      }),
    ).toMatchObject({
      update_password: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle UPDATE_PASSWORD_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_PASSWORD}_SUCCESS`,
      }),
    ).toMatchObject({
      update_password: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle UPDATE_PASSWORD_FAIL', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_PASSWORD}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      update_password: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle UPDATE_USER_PENDING', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_USER}_PENDING`,
      }),
    ).toMatchObject({
      update: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle UPDATE_USER_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_USER}_SUCCESS`,
      }),
    ).toMatchObject({
      update: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle UPDATE_USER_FAIL', () => {
    expect(
      users(undefined, {
        type: `${UPDATE_USER}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      update: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle INITIAL_PASSWORD_PENDING', () => {
    expect(
      users(undefined, {
        type: `${INITIAL_PASSWORD}_PENDING`,
      }),
    ).toMatchObject({
      initial: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle INITIAL_PASSWORD_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${INITIAL_PASSWORD}_SUCCESS`,
      }),
    ).toMatchObject({
      initial: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle INITIAL_PASSWORD_FAIL', () => {
    expect(
      users(undefined, {
        type: `${INITIAL_PASSWORD}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      initial: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });

  it('should handle RESET_PASSWORD_PENDING', () => {
    expect(
      users(undefined, {
        type: `${RESET_PASSWORD}_PENDING`,
      }),
    ).toMatchObject({
      reset: {
        error: null,
        loaded: false,
        loading: true,
      },
    });
  });

  it('should handle RESET_PASSWORD_SUCCESS', () => {
    expect(
      users(undefined, {
        type: `${RESET_PASSWORD}_SUCCESS`,
      }),
    ).toMatchObject({
      reset: {
        error: null,
        loaded: true,
        loading: false,
      },
    });
  });

  it('should handle RESET_PASSWORD_FAIL', () => {
    expect(
      users(undefined, {
        type: `${RESET_PASSWORD}_FAIL`,
        error: 'failed',
      }),
    ).toMatchObject({
      reset: {
        error: 'failed',
        loaded: false,
        loading: false,
      },
    });
  });
});
