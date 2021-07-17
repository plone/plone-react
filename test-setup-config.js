/*
 * This is the mocked config registry loader for tests.
 * It uses some of the default (real) configuration,
 * (mainly) DraftJS one, to not differ too much from reality
 * Ideally, we should mock this ones as well at some point.
 * Views, Widgets and Blocks are mocked already, to keep
 * snapshot consistency and readability.
 */
import React from 'react';
import config from '@plone/volto/registry';
import { loadables } from '@plone/volto/config/Loadables';
import { nonContentRoutes } from '@plone/volto/config/NonContentRoutes';
import ToHTMLRenderers, {
  options as ToHTMLOptions,
} from '@plone/volto/config/RichTextEditor/ToHTML';
import {
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
} from '@plone/volto/config/RichTextEditor/Blocks';
import { contentIcons } from '@plone/volto/config/ContentIcons';

import FromHTMLCustomBlockFn from '@plone/volto/config/RichTextEditor/FromHTML';
import { controlPanelsIcons } from '@plone/volto/config/ControlPanels';
// import { defaultToolbar } from '@plone/volto/config/toolbar';

config.set('settings', {
  apiPath: 'http://localhost:8080/Plone',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  defaultPageSize: 25,
  isMultilingual: false,
  nonContentRoutes,
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
  FromHTMLCustomBlockFn,
  ToHTMLRenderers,
  ToHTMLOptions,
  contentIcons: contentIcons,
  loadables,
  lazyBundles: {
    cms: [
      'prettierStandalone',
      'prettierParserHtml',
      'prismCore',
      'toastify',
      'reactSelect',
      // 'diffLib',
    ],
  },
  controlPanelsIcons,
  apiExpanders: [],
});
config.set('blocks', {
  blocksConfig: {
    listing: {
      templates: {
        default: {
          label: 'Default',
          template: () => (
            <div className="mocked-default-listing-template"></div>
          ),
        },
        imageGallery: {
          label: 'Image gallery',
          template: () => <div className="mocked-image-listing-template"></div>,
        },
        summary: {
          label: 'Summary',
          template: () => (
            <div className="mocked-summary-listing-template"></div>
          ),
        },
      },
    },
  },
  requiredBlocks: [],
  groupBlocksOrder: [
    { id: 'mostUsed', title: 'Most used' },
    { id: 'text', title: 'Text' },
    { id: 'media', title: 'Media' },
    { id: 'common', title: 'Common' },
  ],
  initialBlocks: {},
});
config.set('views', {
  layoutViews: {},
  contentTypesViews: {},
  defaultView: {},
  errorViews: {},
});

function BaseWidget(name) {
  return (props) => (
    <div id={`mocked-field-${props.id}`} className={`mocked-${name}-widget`}>
      {props.title || 'No title'} - {props.description || 'No description'}
    </div>
  );
}

config.set('widgets', {
  id: {
    schema: BaseWidget('schema'),
    subjects: BaseWidget('subjects'),
    query: BaseWidget('query'),
    recurrence: BaseWidget('recurrence'),
    remoteUrl: BaseWidget('remoteurl'),
  },
  widget: {
    richtext: BaseWidget('richtext'),
    textarea: BaseWidget('textarea'),
    datetime: BaseWidget('datetime'),
    date: BaseWidget('date'),
    password: BaseWidget('password'),
    file: BaseWidget('file'),
    align: BaseWidget('align'),
    url: BaseWidget('url'),
    email: BaseWidget('email'),
    object_browser: BaseWidget('object_browser'),
  },
  vocabulary: {},
  factory: {},
  choices: BaseWidget('choices'),
  type: {
    boolean: BaseWidget('boolean'),
    array: BaseWidget('array'),
    object: BaseWidget('object'),
    datetime: BaseWidget('datetime'),
    date: BaseWidget('date'),
    password: BaseWidget('password'),
    number: BaseWidget('number'),
    integer: BaseWidget('integer'),
  },
  default: BaseWidget('default'),
});

config.set('toolbar', {
  activities: {
    default: {
      top: [
        {
          match: '/',
          component: () => <div className="view-button">Default View</div>,
        },
      ],
      bottom: [
        {
          match: '/',
          component: () => <div className="view-button">Default bottom</div>,
        },
      ],
    },
    view: {
      top: [
        {
          match: '/',
          component: () => <div className="view-button">View</div>,
        },
      ],
      bottom: [
        {
          match: '/',
          component: () => <div className="view-button">Bottom</div>,
        },
      ],
    },
  },
});

config.set('slots', {});
