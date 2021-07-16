import React from 'react';
import { Pluggable } from '@plone/volto/components/manage/Pluggable';
import GroupedMenuButtons from './GroupedMenuButtons';

const PluggableMenuSection = (props) => {
  const { name, maxSizeBeforeCollapse = 3, params = {}, ...rest } = props;
  return (
    <Pluggable name={name} {...rest}>
      {(pluggables) => (
        <GroupedMenuButtons
          items={pluggables}
          maxSizeBeforeCollapse={maxSizeBeforeCollapse}
          params={params}
        />
      )}
    </Pluggable>
  );
};

export default PluggableMenuSection;
