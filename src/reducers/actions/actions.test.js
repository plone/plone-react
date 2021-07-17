import actions from './actions';
import { LIST_ACTIONS } from '@plone/volto/constants/ActionTypes';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

const actionsFromApi = {
  object: [],
  object_buttons: [],
  site_actions: [],
  user: [],
  document_actions: [],
  portal_tabs: [],
};
const actionsById = arrayWIdsToObject(actionsFromApi);

describe('Actions reducer', () => {
  it('should return the initial state', () => {
    expect(actions()).toEqual({
      error: null,
      actions: actionsFromApi,
      actionsById,
      loaded: false,
      loading: false,
    });
  });

  it('should handle LIST_ACTIONS_PENDING', () => {
    expect(
      actions(undefined, {
        type: `${LIST_ACTIONS}_PENDING`,
      }),
    ).toEqual({
      error: null,
      actions: actionsFromApi,
      actionsById,
      loaded: false,
      loading: true,
    });
  });

  it('should handle LIST_ACTIONS_SUCCESS', () => {
    expect(
      actions(undefined, {
        type: `${LIST_ACTIONS}_SUCCESS`,
        result: {
          object: [],
          object_buttons: [],
          site_actions: [],
          user: [
            {
              icon: '',
              id: 'preferences',
              title: 'Preferences',
            },
            {
              icon: '',
              id: 'dashboard',
              title: 'Dashboard',
            },
            {
              icon: '',
              id: 'plone_setup',
              title: 'Site Setup',
            },
            {
              icon: '',
              id: 'logout',
              title: 'Log out',
            },
          ],
          document_actions: [],
          portal_tabs: [],
        },
      }),
    ).toEqual({
      error: null,
      actions: {
        object: [],
        object_buttons: [],
        site_actions: [],
        user: [
          {
            icon: '',
            id: 'preferences',
            title: 'Preferences',
          },
          {
            icon: '',
            id: 'dashboard',
            title: 'Dashboard',
          },
          {
            icon: '',
            id: 'plone_setup',
            title: 'Site Setup',
          },
          {
            icon: '',
            id: 'logout',
            title: 'Log out',
          },
        ],
        document_actions: [],
        portal_tabs: [],
      },
      actionsById: {
        document_actions: {},
        object: {},
        object_buttons: {},
        portal_tabs: {},
        site_actions: {},
        user: {
          preferences: {
            icon: '',
            id: 'preferences',
            title: 'Preferences',
          },
          dashboard: {
            icon: '',
            id: 'dashboard',
            title: 'Dashboard',
          },
          logout: {
            icon: '',
            id: 'logout',
            title: 'Log out',
          },
          plone_setup: {
            icon: '',
            id: 'plone_setup',
            title: 'Site Setup',
          },
        },
      },
      loaded: true,
      loading: false,
    });
  });

  it('should handle LIST_ACTIONS_FAIL', () => {
    expect(
      actions(undefined, {
        type: `${LIST_ACTIONS}_FAIL`,
        error: 'failed',
      }),
    ).toEqual({
      error: 'failed',
      actions: {},
      actionsById: {
        document_actions: {},
        object: {},
        object_buttons: {},
        portal_tabs: {},
        site_actions: {},
        user: {},
      },
      loaded: false,
      loading: false,
    });
  });
});
