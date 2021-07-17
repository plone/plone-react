/**
 * Slot actions.
 * @module actions/slots/slots
 */

import { flattenToAppURL } from '@plone/volto/helpers';
import {
  GET_SLOTS,
  GET_SLOT,
  SAVE_SLOT,
} from '@plone/volto/constants/ActionTypes';

/**
 * Get slots.
 *
 * @function getSlots
 * @param {string} url Content url.
 * @returns {Object} Get slots action.
 */
export function getSlots(url) {
  const path = flattenToAppURL(url);
  return {
    type: GET_SLOTS,
    request: {
      op: 'get',
      path: `${path}/@slots`,
    },
  };
}

/**
 * Get data for one slot.
 *
 * @function getSlot
 * @param {string} url Content url.
 * @returns {Object} Get slot action.
 */
export function getSlot(url, slotName) {
  return {
    type: GET_SLOT,
    request: {
      op: 'get',
      path: `${url}/@slots/${slotName}`,
    },
  };
}

export function saveSlot(contextUrl, slotName, data) {
  return {
    type: SAVE_SLOT,
    request: {
      op: 'patch',
      path: `${contextUrl}/@slots/${slotName}`,
      data,
    },
  };
}
