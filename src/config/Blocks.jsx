import { defineMessages } from 'react-intl';

import ViewTitleBlock from '@plone/volto/components/manage/Blocks/Title/View';
import ViewDescriptionBlock from '@plone/volto/components/manage/Blocks/Description/View';
import ViewToCBlock from '@plone/volto/components/manage/Blocks/ToC/View';
import ViewTextBlock from '@plone/volto/components/manage/Blocks/Text/View';
import ViewImageBlock from '@plone/volto/components/manage/Blocks/Image/View';
import ViewLeadImageBlock from '@plone/volto/components/manage/Blocks/LeadImage/View';
import ViewListingBlock from '@plone/volto/components/manage/Blocks/Listing/View';
import ViewVideoBlock from '@plone/volto/components/manage/Blocks/Video/View';
import ViewHeroImageLeftBlock from '@plone/volto/components/manage/Blocks/HeroImageLeft/View';
import ViewMapBlock from '@plone/volto/components/manage/Blocks/Maps/View';
import ViewHTMLBlock from '@plone/volto/components/manage/Blocks/HTML/View';
import ViewTableBlock from '@plone/volto/components/manage/Blocks/Table/View';

import EditTitleBlock from '@plone/volto/components/manage/Blocks/Title/Edit';
import EditDescriptionBlock from '@plone/volto/components/manage/Blocks/Description/Edit';
import EditToCBlock from '@plone/volto/components/manage/Blocks/ToC/Edit';
import EditTextBlock from '@plone/volto/components/manage/Blocks/Text/Edit';
import EditImageBlock from '@plone/volto/components/manage/Blocks/Image/Edit';
import EditLeadImageBlock from '@plone/volto/components/manage/Blocks/LeadImage/Edit';
import EditListingBlock from '@plone/volto/components/manage/Blocks/Listing/Edit';
import DefaultListingBlockTemplate from '@plone/volto/components/manage/Blocks/Listing/DefaultTemplate';
import SummaryListingBlockTemplate from '@plone/volto/components/manage/Blocks/Listing/SummaryTemplate';
import EditVideoBlock from '@plone/volto/components/manage/Blocks/Video/Edit';
import EditHeroImageLeftBlock from '@plone/volto/components/manage/Blocks/HeroImageLeft/Edit';
import EditMapBlock from '@plone/volto/components/manage/Blocks/Maps/Edit';
import EditHTMLBlock from '@plone/volto/components/manage/Blocks/HTML/Edit';
import EditTableBlock from '@plone/volto/components/manage/Blocks/Table/Edit';

import ContextNavigationEdit from '@plone/volto/components/manage/Blocks/ContextNavigation/ContextNavigationEdit';
import ContextNavigationView from '@plone/volto/components/manage/Blocks/ContextNavigation/ContextNavigationView';

import descriptionSVG from '@plone/volto/icons/description.svg';
import titleSVG from '@plone/volto/icons/text.svg';
import textSVG from '@plone/volto/icons/subtext.svg';
import cameraSVG from '@plone/volto/icons/camera.svg';
import videoSVG from '@plone/volto/icons/videocamera.svg';
import globeSVG from '@plone/volto/icons/globe.svg';
import codeSVG from '@plone/volto/icons/code.svg';
import heroSVG from '@plone/volto/icons/hero.svg';
import tableSVG from '@plone/volto/icons/table.svg';
import listBulletSVG from '@plone/volto/icons/list-bullet.svg';
import tocSVG from '@plone/volto/icons/list-bullet.svg';

import ImageGalleryListingBlockTemplate from '@plone/volto/components/manage/Blocks/Listing/ImageGallery';
import BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
import TextSettingsSchema from '@plone/volto/components/manage/Blocks/Text/Schema';
import ImageSettingsSchema from '@plone/volto/components/manage/Blocks/Image/Schema';
import ToCSettingsSchema from '@plone/volto/components/manage/Blocks/ToC/Schema';

defineMessages({
  title: {
    id: 'title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'description',
    defaultMessage: 'Description',
  },
  text: {
    id: 'text',
    defaultMessage: 'Text',
  },
  toc: {
    id: 'toc',
    defaultMessage: 'Table of Contents',
  },
  image: {
    id: 'image',
    defaultMessage: 'Image',
  },
  video: {
    id: 'video',
    defaultMessage: 'Video',
  },
  hero: {
    id: 'hero',
    defaultMessage: 'Hero',
  },
  table: {
    id: 'table',
    defaultMessage: 'Table',
  },
  maps: {
    id: 'maps',
    defaultMessage: 'Maps',
  },
  html: {
    id: 'html',
    defaultMessage: 'HTML',
  },
  leadimage: {
    id: 'leadimage',
    defaultMessage: 'Lead Image Field',
  },
  listing: {
    id: 'listing',
    defaultMessage: 'Listing',
  },
  // Groups
  mostUsed: {
    id: 'mostUsed',
    defaultMessage: 'Most used',
  },
  media: {
    id: 'media',
    defaultMessage: 'Media',
  },
  common: {
    id: 'common',
    defaultMessage: 'Common',
  },
  site: {
    id: 'site',
    defaultMessage: 'Site',
  },
});

const groupBlocksOrder = [
  { id: 'mostUsed', title: 'Most used' },
  { id: 'text', title: 'Text' },
  { id: 'media', title: 'Media' },
  { id: 'common', title: 'Common' },
  { id: 'site', title: 'Site' },
];

const toolbarGroups = [
  { id: 'slot', title: 'Slot' },
  { id: 'misc', title: 'Miscellaneous' },
];

const blocksConfig = {
  title: {
    id: 'title',
    title: 'Title',
    icon: titleSVG,
    group: 'text',
    view: ViewTitleBlock,
    edit: EditTitleBlock,
    schema: BlockSettingsSchema,
    restricted: ({ properties, block }) =>
      properties.blocks_layout?.items?.find(
        (uid) => properties.blocks?.[uid]?.['@type'] === block.id,
      ),
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  },
  description: {
    id: 'description',
    title: 'Description',
    icon: descriptionSVG,
    group: 'text',
    view: ViewDescriptionBlock,
    edit: EditDescriptionBlock,
    schema: BlockSettingsSchema,
    restricted: true,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  },
  text: {
    id: 'text',
    title: 'Text',
    icon: textSVG,
    group: 'text',
    view: ViewTextBlock,
    edit: EditTextBlock,
    schema: TextSettingsSchema,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 0,
    disableQuantaToolbar: true,
    security: {
      addPermission: [],
      view: [],
    },
    blockHasValue: (data) => {
      const isEmpty =
        !data.text ||
        (data.text?.blocks?.length === 1 && data.text.blocks[0].text === '');
      return !isEmpty;
    },
  },
  image: {
    id: 'image',
    title: 'Image',
    icon: cameraSVG,
    group: 'media',
    view: ViewImageBlock,
    edit: EditImageBlock,
    schema: ImageSettingsSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
  leadimage: {
    id: 'leadimage',
    title: 'Lead Image Field',
    icon: cameraSVG,
    group: 'media',
    view: ViewLeadImageBlock,
    edit: EditLeadImageBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
  listing: {
    id: 'listing',
    title: 'Listing',
    icon: listBulletSVG,
    group: 'common',
    view: ViewListingBlock,
    edit: EditListingBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    showLinkMore: false,
    security: {
      addPermission: [],
      view: [],
    },
    variations: [
      {
        id: 'default',
        isDefault: true,
        title: 'Default',
        template: DefaultListingBlockTemplate,
      },
      {
        id: 'imageGallery',
        title: 'Image gallery',
        template: ImageGalleryListingBlockTemplate,
      },
      {
        id: 'summary',
        title: 'Summary',
        template: SummaryListingBlockTemplate,
      },
    ],
  },
  video: {
    id: 'video',
    title: 'Video',
    icon: videoSVG,
    group: 'media',
    view: ViewVideoBlock,
    edit: EditVideoBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
  toc: {
    id: 'toc',
    title: 'Table of Contents',
    icon: tocSVG,
    group: 'common',
    view: ViewToCBlock,
    edit: EditToCBlock,
    schema: ToCSettingsSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  },
  hero: {
    id: 'hero',
    title: 'Hero',
    icon: heroSVG,
    group: 'common',
    view: ViewHeroImageLeftBlock,
    edit: EditHeroImageLeftBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  },
  maps: {
    id: 'maps',
    title: 'Maps',
    icon: globeSVG,
    group: 'common',
    view: ViewMapBlock,
    edit: EditMapBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
  html: {
    id: 'html',
    title: 'HTML',
    icon: codeSVG,
    group: 'common',
    view: ViewHTMLBlock,
    edit: EditHTMLBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: false,
    sidebarTab: 0,
    security: {
      addPermission: [],
      view: [],
    },
  },
  table: {
    id: 'table',
    title: 'Table',
    icon: tableSVG,
    group: 'common',
    view: ViewTableBlock,
    edit: EditTableBlock,
    schema: BlockSettingsSchema,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
  contextNavigation: {
    id: 'contextNavigation',
    title: 'Navigation',
    icon: tableSVG,
    group: 'site',
    view: ContextNavigationView,
    edit: ContextNavigationEdit,
    schema: BlockSettingsSchema,
    restricted: true,
    isSlotFill: true,
    mostUsed: false,
    blockHasOwnFocusManagement: true,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  },
};

const requiredBlocks = ['title'];

const initialBlocks = {};

export {
  groupBlocksOrder,
  toolbarGroups,
  requiredBlocks,
  blocksConfig,
  initialBlocks,
};
