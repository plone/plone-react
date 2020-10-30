/* eslint no-console: 0 */
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-intl-redux';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { createMemoryHistory } from 'history';
import { ReduxAsyncConnect, loadOnServer } from 'redux-connect';
import { parse as parseUrl } from 'url';
import { keys } from 'lodash';
import cookie, { plugToRequest } from 'react-cookie';
import locale from 'locale';
import { detect } from 'detect-browser';
import path from 'path';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { updateIntl } from 'react-intl-redux';
import { resetServerContext } from 'react-beautiful-dnd';

import routes from '~/routes';
import { settings } from '~/config';

import {
  Html,
  Api,
  persistAuthToken,
  generateSitemap,
  getAPIResourceWithAuth,
} from '@plone/volto/helpers';

import userSession from '@plone/volto/reducers/userSession/userSession';

import ErrorPage from '@plone/volto/error';

import languages from '@plone/volto/constants/Languages';

import configureStore from '@plone/volto/store';

let locales = {};

if (settings) {
  settings.supportedLanguages.forEach((lang) => {
    import('~/../locales/' + lang + '.json').then((locale) => {
      locales = { ...locales, [lang]: locale.default };
    });
  });
}

const supported = new locale.Locales(keys(languages), 'en');

const server = express();
// Internal proxy to bypass CORS while developing.
if (__DEVELOPMENT__ && settings.devProxyToApiPath) {
  const apiPathURL = parseUrl(settings.apiPath);
  const proxyURL = parseUrl(settings.devProxyToApiPath);
  const serverURL = `${proxyURL.protocol}//${proxyURL.host}`;
  const instancePath = proxyURL.pathname;
  server.use(
    '/api',
    createProxyMiddleware({
      target: serverURL,
      pathRewrite: {
        '^/api': `/VirtualHostBase/http/${apiPathURL.hostname}:${apiPathURL.port}${instancePath}/VirtualHostRoot/_vh_api`,
      },
      logLevel: 'silent',
    }),
  );
}

if ((settings.expressMiddleware || []).length)
  server.use('/', settings.expressMiddleware);

const defaultResources = [
  /(.*)\/@@images\/(.*)/,
  /(.*)\/@@download\/(.*)/,
].map((r) => (req) => req.path.match(r));

/**
 * Returns true if the request should be piped from the backend.
 *
 * Allows additional request matchers to be specified in
 * `settings.backendResourceMatch`
 *
 * @param {} request
 */
function isBackendResource(request) {
  return (
    [
      ...defaultResources,
      ...(settings.backendResourceMatch || []),
    ].findIndex((m) => m(request)) > -1
  );
}

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    plugToRequest(req, res);
    const api = new Api(req);

    const url = req.originalUrl || req.url;
    const location = parseUrl(url);

    const browserdetect = detect(req.headers['user-agent']);

    const lang = new locale.Locales(
      cookie.load('I18N_LANGUAGE') ||
        settings.defaultLanguage ||
        req.headers['accept-language'],
    )
      .best(supported)
      .toString();

    const authToken = cookie.load('auth_token');

    const initialState = {
      userSession: { ...userSession(), token: authToken },
      form: req.body,
      intl: {
        defaultLocale: 'en',
        locale: lang,
        messages: locales[lang],
      },
      browserdetect,
    };
    const history = createMemoryHistory({
      initialEntries: [req.url],
    });

    // @loadable/server extractor
    const extractor = new ChunkExtractor({
      statsFile: path.resolve('build/loadable-stats.json'),
      entrypoints: ['client'],
    });

    // Create a new Redux store instance
    const store = configureStore(initialState, history, api);

    persistAuthToken(store);

    if (req.path === '/sitemap.xml.gz') {
      generateSitemap(req).then((sitemap) => {
        res.set('Content-Type', 'application/x-gzip');
        res.set('Content-Encoding', 'gzip');
        res.set('Content-Disposition', 'attachment; filename="sitemap.xml.gz"');
        res.send(sitemap);
      });
    } else if (isBackendResource(req)) {
      getAPIResourceWithAuth(req).then((resource) => {
        function forwardHeaders(headers) {
          headers.forEach((header) => {
            if (resource.headers[header]) {
              res.set(header, resource.headers[header]);
            }
          });
        }
        // Just forward the headers that we need
        forwardHeaders([
          'content-type',
          'content-disposition',
          'cache-control',
        ]);
        res.send(resource.body);
      });
    } else {
      loadOnServer({ store, location, routes, api })
        .then(() => {
          // The content info is in the store at this point thanks to the asynconnect
          // features, then we can force the current language info into the store when
          // coming from an SSR request
          const updatedLang =
            store.getState().content.data?.language?.token ||
            settings.defaultLanguage;
          store.dispatch(
            updateIntl({
              locale: updatedLang,
              messages: locales[updatedLang],
            }),
          );

          const context = {};
          resetServerContext();
          const markup = renderToString(
            <ChunkExtractorManager extractor={extractor}>
              <Provider store={store}>
                <StaticRouter context={context} location={req.url}>
                  <ReduxAsyncConnect routes={routes} helpers={api} />
                </StaticRouter>
              </Provider>
            </ChunkExtractorManager>,
          );

          if (context.url) {
            res.redirect(context.url);
          } else {
            res.status(200).send(
              `<!doctype html>
                ${renderToString(
                  <Html extractor={extractor} markup={markup} store={store} />,
                )}
              `,
            );
          }
        })
        .catch((error) => {
          const errorPage = (
            <Provider store={store}>
              <StaticRouter context={{}} location={req.url}>
                <ErrorPage message={error.message} />
              </StaticRouter>
            </Provider>
          );

          res.set({
            'Cache-Control': 'public, max-age=60, no-transform',
          });

          // Displays error in console
          console.error(error);

          res.status(500).send(`<!doctype html> ${renderToString(errorPage)}`);
        });
    }
  });

server.apiPath = settings.apiPath;
server.devProxyToApiPath = settings.devProxyToApiPath;
export default server;
