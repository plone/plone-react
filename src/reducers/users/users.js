/**
 * Users reducer.
 * @module reducers/users/users
 */

import { startsWith } from 'lodash';

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

const initialState = {
  user: {},
  users: [],
  create: {
    error: null,
    loaded: false,
    loading: false,
  },
  get: {
    error: null,
    loaded: false,
    loading: false,
  },
  list: {
    error: null,
    loaded: false,
    loading: false,
  },
  delete: {
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
};

/**
 * Get request key
 * @function getRequestKey
 * @param {string} actionType Action type.
 * @returns {string} Request key.
 */
function getRequestKey(actionType) {
  if (startsWith(actionType, 'UPDATE_PASSWORD')) {
    return 'update_password';
  }
  return actionType.split('_')[0].toLowerCase();
}

/**
 * Users reducer.
 * @function users
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
export default function users(state = initialState, action = {}) {
  switch (action.type) {
    case `${CREATE_USER}_PENDING`:
    case `${DELETE_USER}_PENDING`:
    case `${GET_USER}_PENDING`:
    case `${LIST_USERS}_PENDING`:
    case `${UPDATE_USER}_PENDING`:
    case `${UPDATE_PASSWORD}_PENDING`:
    case `${INITIAL_PASSWORD}_PENDING`:
    case `${RESET_PASSWORD}_PENDING`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case `${GET_USER}_SUCCESS`:
      return {
        ...state,
        user: action.result,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${LIST_USERS}_SUCCESS`:
      return {
        ...state,
        users: action.result,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${CREATE_USER}_SUCCESS`:
    case `${DELETE_USER}_SUCCESS`:
    case `${UPDATE_USER}_SUCCESS`:
    case `${UPDATE_PASSWORD}_SUCCESS`:
    case `${INITIAL_PASSWORD}_SUCCESS`:
    case `${RESET_PASSWORD}_SUCCESS`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: true,
          error: null,
        },
      };
    case `${GET_USER}_FAIL`:
      return {
        ...state,
        user: {},
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    case `${LIST_USERS}_FAIL`:
      return {
        ...state,
        users: [],
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    case `${CREATE_USER}_FAIL`:
    case `${DELETE_USER}_FAIL`:
    case `${UPDATE_USER}_FAIL`:
    case `${UPDATE_PASSWORD}_FAIL`:
    case `${INITIAL_PASSWORD}_FAIL`:
    case `${RESET_PASSWORD}_FAIL`:
      return {
        ...state,
        [getRequestKey(action.type)]: {
          loading: false,
          loaded: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}
