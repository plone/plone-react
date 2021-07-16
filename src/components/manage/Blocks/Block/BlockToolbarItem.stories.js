import React from 'react';
import Wrapper from '@plone/volto/storybook';
import BlockToolbarItem from './BlockToolbarItem';
import { PluggablesProvider } from '@plone/volto/components/manage/Pluggable';
import trashSVG from '@plone/volto/icons/delete.svg';
import hideSVG from '@plone/volto/icons/hide.svg';
import showSVG from '@plone/volto/icons/show.svg';

const icons = {
  showSVG,
  hideSVG,
  trashSVG,
};

const BlockToolbarItemStory = (args) => {
  return (
    <Wrapper>
      <PluggablesProvider>
        <BlockToolbarItem {...args} icon={icons[args.icon]} />
      </PluggablesProvider>
    </Wrapper>
  );
};

export const Default = BlockToolbarItemStory.bind({});

Default.args = {
  id: 'field-default',
  label: 'Sample entry',
  icon: 'trashSVG',
  isMenuShape: false,
};

export default {
  title: 'Quanta/BlockToolbaritem',
  component: BlockToolbarItem,
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    // controlled value prop
    icon: {
      // control: {
      //   disable: true,
      // },
      control: {
        type: 'select',
        options: ['showSVG', 'hideSVG', 'trashSVG'],
      },
    },
  },
  // excludeStories: ['searchResults'],
  // subcomponents: { ArgsTable },
};
