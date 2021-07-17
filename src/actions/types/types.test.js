import { getTypes } from './types';
import { GET_TYPES } from '@plone/volto/constants/ActionTypes';
import { arrayWIdsToObject } from '@plone/volto/helpers/Utils/Utils';

const actions = { user: [{ id: 'logout' }] };
const actionsById = arrayWIdsToObject(actions);

describe('Types action', () => {
  describe('getTypes', () => {
    it('should create an action to get the types', () => {
      const getState = () => ({
        actions: { actions, actionsById },
      });
      const url = '/blog';
      const dispatch = jest.fn();

      getTypes(url)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith({
        type: GET_TYPES,
        request: {
          op: 'get',
          path: `${url}/@types`,
        },
      });
    });
  });
});
