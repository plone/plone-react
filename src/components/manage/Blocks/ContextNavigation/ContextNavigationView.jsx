import React from 'react';
import ConnectedContextNavigation from '@plone/volto/components/theme/Navigation/ContextNavigation';
import { flattenToAppURL } from '@plone/volto/helpers';

const ContextNavigationView = ({ data = {} }) => {
  const navProps = { ...data };
  const root_path = data?.root_node?.[0]?.['@id'];
  if (root_path) navProps['root_path'] = flattenToAppURL(root_path);

  return (
    <>
      <ConnectedContextNavigation params={navProps} />
    </>
  );
};

export default ContextNavigationView;
