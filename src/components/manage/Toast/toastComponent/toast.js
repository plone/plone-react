import { toast as toastify } from 'react-toastify';
import config from '@plone/volto/registry';

const toast = {
  error: (message, opts) =>
    toastify.error(message, config.settings.toastConfig || opts),
  success: (message, opts) =>
    toastify.success(message, config.settings.toastConfig || opts),
  info: (message, opts) =>
    toastify.info(message, config.settings.toastConfig || opts),
  warn: (message, opts) =>
    toastify.warn(message, config.settings.toastConfig || opts),
  dismiss: (toastId) => toastify.dismiss(toastId),
  isActive: (toastId) => toastify.isActive(toastId),
  update: (toastId, opts) =>
    toastify.update(toastId, config.settings.toastConfig || opts),
  clearWaitingQueue: (opts) =>
    toastify.clearWaitingQueue(config.settings.toastConfig || opts),
  done: (toastId) => toastify.done(toastId),
  configure: (opts) => toastify.configure(config.settings.toastConfig || opts),
};

export default toast;
