/**
 * Config.
 * @module config
 */
import { parse as parseUrl } from 'url';
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
import { controlPanelsIcons } from './ControlPanels';

import applyAddonConfiguration from 'load-volto-addons';

import ConfigRegistry from '@plone/volto/registry';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || '3000';

const apiPath =
  process.env.RAZZLE_API_PATH ||
  (__DEVELOPMENT__ ? `http://${host}:${port}` : '');

const getServerURL = (url) => {
  if (!url) return;
  const apiPathURL = parseUrl(url);
  return `${apiPathURL.protocol}//${apiPathURL.hostname}${
    apiPathURL.port ? `:${apiPathURL.port}` : ''
  }`;
};

// Sensible defaults for publicURL
// if RAZZLE_PUBLIC_URL is present, use it
// if in DEV, use the host/port combination by default
// if in PROD, assume it's RAZZLE_API_PATH server name (no /api or alikes) or fallback
// to DEV settings if RAZZLE_API_PATH is not present
const publicURL =
  process.env.RAZZLE_PUBLIC_URL ||
  (__DEVELOPMENT__
    ? `http://${host}:${port}`
    : getServerURL(process.env.RAZZLE_API_PATH) || `http://${host}:${port}`);

const serverConfig =
  typeof __SERVER__ !== 'undefined' && __SERVER__
    ? require('./server').default
    : {};

let config = {
  settings: {
    host,
    port,
    // The URL Volto is going to be served (see sensible defaults above)
    publicURL,
    // Internal proxy to bypass CORS *while developing*. Not intended for production use.
    // In production, the proxy is disabled, make sure you specify an apiPath that does
    // not require CORS to work.
    apiPath,
    apiExpanders: [],
    devProxyToApiPath:
      process.env.RAZZLE_DEV_PROXY_API_PATH ||
      process.env.RAZZLE_API_PATH ||
      'http://localhost:8080/Plone', // Set it to '' for disabling the proxy
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
    expressMiddleware: serverConfig.expressMiddleware, // BBB
    defaultBlockType: 'text',
    verticalFormTabs: false,
    persistentReducers: ['blocksClipboard'],
    initialReducersBlacklist: [], // reducers in this list won't be hydrated in windows.__data
    asyncPropsExtenders: [], // per route asyncConnect customizers
    sentryOptions: {
      ...sentryOptions,
    },
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
    appExtras: [],
    maxResponseSize: 2000000000, // This is superagent default (200 mb)
    serverConfig,
    storeExtenders: [],
    showTags: true,
    controlPanelsIcons,
    externalRoutes: [
      // URL to be considered as external
      // {
      //   match: {
      //     path: '/news',
      //     exact: false,
      //     strict: false,
      //   },
      //   url(payload) {
      //     return payload.location.pathname;
      //   },
      // },
    ],
    showSelfRegistration: false,
    useQuantaToolbar: true,
    contentMetadataTagsImageField: 'image',
    hasWorkingCopySupport: false,
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
    showEditBlocksInBabelView: false,
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

ConfigRegistry.settings = settings;
ConfigRegistry.blocks = blocks;
ConfigRegistry.views = views;
ConfigRegistry.widgets = widgets;
ConfigRegistry.addonRoutes = addonRoutes;
ConfigRegistry.addonReducers = addonReducers;
ConfigRegistry.appExtras = appExtras;
