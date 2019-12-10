/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { isExternalLink } from '@plone/volto/helpers';

/**
 * Link component class.
 * @function Link
 * @param {string} url
 * @returns {string} Markup of the component.
 */
const Link = props => {
  const { to, children, ...attrs } = props;
  return isExternalLink(to) ? (
    <a href={to} {...attrs}>
      {children}
    </a>
  ) : (
    <RouterLink to={to} {...attrs}>
      {children}
    </RouterLink>
  );
};

export default Link;
