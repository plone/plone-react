/**
 * Layouts.
 * @module constants/Workflows
 */

import { last, split } from 'lodash';
import { createIntl, createIntlCache } from 'react-intl';

const locale = Locale.setLocale(); //I don't know how to get the locale message
const messages = Locale.setMessages(); //getting messages from the json file.
const cache = createIntlCache();
const intl = createIntl({ locale, messages }, cache);
// reference https://stackoverflow.com/questions/47785313/react-intl-for-non-components

export default function getWorkflowMapping(url, current) {
  const mapping = {
    published: {
      value: intl.formatMessage({ id: 'public' }),
      label: intl.formatMessage({ id: 'Public' }),
      color: '#007bc1',
      url,
    },
    publish: {
      value: intl.formatMessage({ id: 'public' }),
      label: intl.formatMessage({ id: 'Public' }),
      color: '#007bc1',
      url,
    },
    private: {
      value: intl.formatMessage({ id: 'private' }),
      label: intl.formatMessage({ id: 'Private' }),
      color: '#ed4033',
      url,
    },
    pending: {
      value: intl.formatMessage({ id: 'pending' }),
      label: intl.formatMessage({ id: 'Pending' }),
      color: '#f6a808',
      url,
    },
    send_back: {
      value: intl.formatMessage({ id: 'private' }),
      label: intl.formatMessage({ id: 'Private' }),
      color: '#ed4033',
      url,
    },
    retract: {
      value: intl.formatMessage({ id: 'private' }),
      label: intl.formatMessage({ id: 'Private' }),
      color: '#ed4033',
      url,
    },
    submit: {
      value: intl.formatMessage({ id: 'review' }),
      label: intl.formatMessage({ id: 'Review' }),
      color: '#f4e037',
      url,
    },
  };

  if (url) {
    const key = last(split(url, '/'));
    if (key in mapping) {
      return mapping[key];
    }

    return { value: key, label: key, color: '#000', url };
  }

  if (current in mapping) {
    return mapping[current];
  }

  return { value: current, label: current, color: '#000', url };
}
