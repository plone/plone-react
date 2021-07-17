import '@plone/volto/config'; // This is the bootstrap for the global config - client side
import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { ReduxAsyncConnect } from '@plone/volto/helpers/AsyncConnect';
import { loadableReady } from '@loadable/component';
import routes from '~/routes';
import config from '@plone/volto/registry';
import '~/theme';

import configureStore from '@plone/volto/store';
import { Api, persistAuthToken, ScrollToTop } from '@plone/volto/helpers';

import * as Sentry from '@sentry/browser';
import initSentry from '@plone/volto/sentry';

export const history = createBrowserHistory();

initSentry(Sentry);

function reactIntlErrorHandler(error) {
  if (process.env.NODE_ENV !== 'production') {
    /* eslint no-console: 0 */
    console.info(error);
  }
}

export default () => {
  const api = new Api();

  const store = configureStore(window.__data, history, api);
  persistAuthToken(store);

  // On Cypress we expose the history, the store and the settings
  // so we can access from Cypress and manipulate them
  if (window.Cypress) {
    window.appHistory = history;
    window.store = store;
    window.settings = config.settings;
  }

  // If Host header is present (so window.env.apiPath is)
  if (window.env.apiPath) {
    config.settings.apiPath = window.env.apiPath;
  }

  loadableReady(() => {
    hydrate(
      <Provider store={store}>
        <IntlProvider onError={reactIntlErrorHandler}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              <ReduxAsyncConnect routes={routes} helpers={api} />
            </ScrollToTop>
          </ConnectedRouter>
        </IntlProvider>
      </Provider>,
      document.getElementById('main'),
    );
  });
};
