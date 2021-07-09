import { find, isBoolean, isObject, isArray } from 'lodash';
import { getBoolean } from '@plone/volto/helpers';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
});

/**
 * Given the value from the API, it normalizes to a value valid to use in react-select.
 * This is necessary because of the inconsistencies in p.restapi vocabularies implementations as
 * they need to adapt to react-select public interface.
 * @function normalizeValue
 * @param {array} choices The choices
 * @param {string|object|boolean|array} value The value
 * @returns {Object} An object of shape {label: "", value: ""}.
 */
export function normalizeValue(choices, value) {
  if (!isObject(value) && isBoolean(value)) {
    // We have a boolean value, which means we need to provide a "No value"
    // option
    const label = find(choices, (o) => getBoolean(o[0]) === value);
    return label
      ? {
          label: label[1],
          value,
        }
      : {};
  }
  if (value === undefined) return null;
  if (!value || value.length === 0) return null;
  if (value === 'no-value') {
    return {
      label: this.props.intl.formatMessage(messages.no_value),
      value: 'no-value',
    };
  }

  if (isArray(value) && choices.length > 0) {
    return value.map((v) => ({
      label: find(choices, (o) => o[0] === v)?.[1] || v,
      value: v,
    }));
  } else if (isObject(value)) {
    return {
      label: value.title !== 'None' && value.title ? value.title : value.token,
      value: value.token,
    };
  } else if (value && choices && choices.length > 0 && isArray(choices[0])) {
    return { label: find(choices, (o) => o[0] === value)?.[1] || value, value };
  } else if (
    value &&
    choices &&
    choices.length > 0 &&
    Object.keys(choices[0]).includes('value') &&
    Object.keys(choices[0]).includes('label')
  ) {
    return find(choices, (o) => o.value === value) || null;
  } else {
    return null;
  }
}
