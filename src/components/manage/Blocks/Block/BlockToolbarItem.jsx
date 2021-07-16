/**
 * A Quanta toolbar entry button that can render itself either as
 * a Dropdown.Item (in the more menu) or a simple Button.
 *
 */

import React from 'react';
import { Dropdown, Button } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';

const BlockToolbarItem = (props) => {
  const { isMenuShape = false, icon, label, onClick } = props;
  return isMenuShape ? (
    <Dropdown.Item onClick={onClick}>
      <Icon name={icon} size="18px" />
      {label}
    </Dropdown.Item>
  ) : (
    <Button icon basic onClick={onClick} title={label}>
      <Icon name={icon} size="18px" />
    </Button>
  );
};

export default BlockToolbarItem;
