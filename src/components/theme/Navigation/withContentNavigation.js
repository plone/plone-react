import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { getBaseUrl } from '@plone/volto/helpers';
import { getContextNavigation } from '@plone/volto/actions';

import { contextNavPath } from '@plone/volto/helpers/ContextNavigation';

export function withContentNavigation(WrappedComponent) {
  /**
   * Options passed in params can be:
   *
   * - name - The title of the navigation tree.
   * - root_path - Root node path, can be "frontend path", derived from router
   * - includeTop - Bool, Include top nodeschema
   * - currentFolderOnly - Bool, Only show the contents of the current folder.
   * - topLevel - Int, Start level
   * - bottomLevel - Int, Navigation tree depth
   * - no_icons - Bool, Suppress Icons
   * - thumb_scale - String, Override thumb scale
   * - no_thumbs = Bool, Suppress thumbs
   *
   */
  function Wrapped(props) {
    const {
      location,
      pathname = getBaseUrl(location.pathname),
      params = {},
    } = props;

    const path = contextNavPath(pathname, params);

    const dispatch = useDispatch();
    const nav = useSelector((state) => {
      return state.contextNavigation?.[path]?.data;
    });

    useDeepCompareEffect(() => {
      dispatch(getContextNavigation(pathname, params));
    }, [pathname, dispatch, params]);

    return <WrappedComponent {...props} navigation={nav} />;
  }

  Wrapped.propTypes = {
    /**
     * Location, from router
     */
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }),
    /**
     * Parameters passed to the @contextnavigation endpoint
     */
    params: PropTypes.shape({
      name: PropTypes.string,
      root_path: PropTypes.string,
      includeTop: PropTypes.bool,
      currentFolderOnly: PropTypes.bool,
      topLevel: PropTypes.number,
      bottomLevel: PropTypes.number,
      no_icons: PropTypes.bool,
      thumb_scale: PropTypes.string,
      no_thumbs: PropTypes.bool,
    }),
  };

  Wrapped.displayName = `WithContextNavigation(${getDisplayName(
    WrappedComponent,
  )})`;

  return Wrapped;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
