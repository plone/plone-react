import React from 'react';
import { DropdownWithButton } from './Dropdown';
import Wrapper from '@plone/volto/storybook';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import addSVG from '@plone/volto/icons/add-document.svg';
import { BasicToolbar } from '@plone/volto/components/manage/Toolbar/Toolbar';
import { Bottom } from '@plone/volto/components/manage/Toolbar/ToolbarComponents';
import { Container } from 'semantic-ui-react';
import { toolbar } from '~/config';
// import { Meta, Story, Canvas, ArgsTable } from '@storybook/addon-docs/blocks';
// import { defineMessages, injectIntl } from 'react-intl';
// import { bottom } from '@plone/volto/config/toolbar';

export default {
  title: 'Dropdown',
  component: DropdownWithButton,
  decorators: [
    (Story) => (
      <Wrapper location={{ pathname: '/folder2/folder21/doc212' }}>
        <Container>
          <Story />
        </Container>
      </Wrapper>
    ),
  ],
  parameters: {
    docs: {
      inlineStories: false,
      description: {
        component: `### Custom dropdown component

You can register a custom dropdown with the DropdownWithButton component.
      `,
      },
    },
  },
};

export const DropdownWithMenu = () => {
  const { defaultViewActions, defaultBottomActions } = toolbar;
  const activity = {
    top: [
      ...defaultViewActions,
      (props) => (
        <DropdownWithButton
          {...props}
          name="new-add"
          title="Add content"
          icon={<Icon name={addSVG} size="30px" />}
          headerActions={
            <button aria-label={'Add'} onClick={() => {}} tabIndex={0}>
              <Icon name={addSVG} size="30px" />
            </button>
          }
        >
          <div>Hello!</div>
        </DropdownWithButton>
      ),
    ],
    bottom: [
      (props) => <Bottom {...props} actionComponents={defaultBottomActions} />,
    ],
  };
  return (
    <div role="navigation" id="toolbar">
      <BasicToolbar {...activity} pathname="/folder2/folder21/doc212" />
    </div>
  );
};

DropdownWithMenu.storyName = 'Dropdown';
DropdownWithMenu.parameters = {
  docs: {
    source: {
      code: `
        <DropdownWithButton
          {...props}
          name="new-add"
          title="Add content"
          icon={<Icon name={addSVG} size="30px" />}
          headerActions={
            <button aria-label={'Add'} onClick={() => {}} tabIndex={0}>
              <Icon name={addSVG} size="30px" />
            </button>
          }
        >
          <div>Hello!</div>
        </DropdownWithButton>
      `,
    },
  },
};
