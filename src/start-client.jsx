import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-intl-redux';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { ReduxAsyncConnect } from 'redux-connect';
import routes from '~/routes';
import '~/theme';

import configureStore from '@plone/volto/store';
import {
  Api,
  persistAuthToken,
  AnimationWrapper,
  ScrollToTop,
} from '@plone/volto/helpers';

export const history = createBrowserHistory();

export default () => {
  const api = new Api();

  const store = configureStore(window.__data, history, api);
  persistAuthToken(store);

  hydrate(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AnimationWrapper>
          <ScrollToTop>
            <ReduxAsyncConnect routes={routes} helpers={api} />
          </ScrollToTop>
        </AnimationWrapper>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('main'),
  );
};
