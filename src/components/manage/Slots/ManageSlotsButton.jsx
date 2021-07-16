import React from 'react';
import { useSelector } from 'react-redux';
import config from '@plone/volto/registry';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import manageSlotsSVG from '@plone/volto/icons/server.svg';
import { DropdownWithButton } from '@plone/volto/components/manage/Toolbar/Dropdown';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';

export default function ManageSlotsButton(props) {
  const { content } = props;
  const { slots } = config;
  const editableSlots = useSelector((state) => {
    return Object.keys(slots)
      .filter((name) => slots[name].manage)
      .filter((name) =>
        state.slots?.[name]
          ? state.slots?.[name]?.edit
          : state.slots?.data?.can_manage_slots,
      )
      .map((name) => ({ id: name, title: slots[name].title }));
  });

  // TODO: i18n

  return content['@id'] && editableSlots.length ? (
    <DropdownWithButton
      {...props}
      name="manage-slots"
      title="Manage slots"
      icon={<Icon name={manageSlotsSVG} size="30px" />}
    >
      <>
        {editableSlots.map(({ id, title }) => {
          const url = flattenToAppURL(content['@id']);
          return (
            <Link
              key={id}
              to={`${url}${url.endsWith('/') ? '' : '/'}edit-slot/${id}`}
            >
              {title}
            </Link>
          );
        })}
      </>
    </DropdownWithButton>
  ) : null;
}
