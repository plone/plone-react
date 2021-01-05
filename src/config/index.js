/**
 * Config.
 * @module config
 */

import { defaultWidget, widgetMapping } from './Widgets';
import {
  layoutViews,
  contentTypesViews,
  defaultView,
  errorViews,
} from './Views';
import { nonContentRoutes } from './NonContentRoutes';
import ToHTMLRenderers, {
  options as ToHTMLOptions,
} from './RichTextEditor/ToHTML';
import {
  extendedBlockRenderMap,
  blockStyleFn,
  listBlockTypes,
} from './RichTextEditor/Blocks';
import plugins, { inlineToolbarButtons } from './RichTextEditor/Plugins';
import FromHTMLCustomBlockFn from './RichTextEditor/FromHTML';
import {
  groupBlocksOrder,
  requiredBlocks,
  blocksConfig,
  initialBlocks,
} from './Blocks';
import { loadables } from './Loadables';

import { sentryOptions } from './Sentry';
import { contentIcons } from './ContentIcons';

import applyAddonConfiguration from 'load-volto-addons';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';

const apiPath =
  process.env.RAZZLE_API_PATH ||
  (__DEVELOPMENT__
    ? `http://${host}:${port}/api`
    : 'http://localhost:8080/Plone');

let config = {
  settings: {
    host,
    port,
    // Internal proxy to bypass CORS *while developing*. Not intended for production use.
    // In production, the proxy is disabled, make sure you specify an apiPath that does
    // not require CORS to work.
    apiPath,
    devProxyToApiPath:
      process.env.RAZZLE_DEV_PROXY_API_PATH || 'http://localhost:8080/Plone', // Set it to '' for disabling the proxy
    // proxyRewriteTarget Set it for set a custom target for the proxy or overide the internal VHM rewrite
    // proxyRewriteTarget: '/VirtualHostBase/http/localhost:8080/Plone/VirtualHostRoot/_vh_api'
    // proxyRewriteTarget: 'https://myvoltositeinproduction.com'
    proxyRewriteTarget: process.env.RAZZLE_PROXY_REWRITE_TARGET || undefined,
    // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8000', // for Volto reference
    // apiPath: process.env.RAZZLE_API_PATH || 'http://localhost:8081/db/web', // for guillotina
    actions_raising_api_errors: ['GET_CONTENT', 'UPDATE_CONTENT'],
    internalApiPath: process.env.RAZZLE_INTERNAL_API_PATH || undefined,
    websockets: process.env.RAZZLE_WEBSOCKETS || false,
    nonContentRoutes,
    extendedBlockRenderMap,
    blockStyleFn,
    listBlockTypes,
    FromHTMLCustomBlockFn,
    richTextEditorInlineToolbarButtons: inlineToolbarButtons,
    richTextEditorPlugins: plugins,
    ToHTMLRenderers,
    ToHTMLOptions,
    imageObjects: ['Image'],
    listingPreviewImageField: 'image',
    customStyleMap: null,
    notSupportedBrowsers: ['ie'],
    defaultPageSize: 25,
    isMultilingual: false,
    supportedLanguages: ['en'],
    defaultLanguage: 'en',
    navDepth: 1,
    expressMiddleware: [],
    defaultBlockType: 'text',
    verticalFormTabs: false,
    persistentReducers: ['blocksClipboard'],
    sentryOptions: {
      ...sentryOptions,
    },
    contentIcons: contentIcons,
    loadables,
    appExtras: [],
    maxResponseSize: 2000000000, // This is superagent default (200 mb)
  },
  widgets: {
    ...widgetMapping,
    default: defaultWidget,
  },
  views: {
    layoutViews,
    contentTypesViews,
    defaultView,
    errorViews,
  },
  blocks: {
    requiredBlocks,
    blocksConfig,
    groupBlocksOrder,
    initialBlocks,
  },

  addonRoutes: [],
  addonReducers: {},
};

config = applyAddonConfiguration(config);

export const settings = config.settings;
export const widgets = config.widgets;
export const views = config.views;
export const blocks = config.blocks;
export const addonRoutes = [...config.addonRoutes];
export const addonReducers = { ...config.addonReducers };
export const appExtras = config.appExtras;
