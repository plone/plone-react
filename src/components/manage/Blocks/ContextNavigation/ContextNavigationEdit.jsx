import React from 'react';
import { EditSchema } from './schema';
import { InlineForm, SidebarPortal } from '@plone/volto/components';
import ContextNavigationView from './ContextNavigationView';

const ContextNavigationFillView = (props) => {
  const schema = EditSchema();
  return (
    <>
      <h3>Context navigation</h3>
      <ContextNavigationView {...props} />{' '}
      <SidebarPortal selected={props.selected}>
        {props.selected && (
          <InlineForm
            title={schema.title}
            schema={schema}
            formData={props.data}
            onChangeField={(id, value) => {
              props.onChangeBlock(props.block, {
                ...props.data,
                [id]: value,
              });
            }}
          />
        )}
      </SidebarPortal>
    </>
  );
};

export default ContextNavigationFillView;
