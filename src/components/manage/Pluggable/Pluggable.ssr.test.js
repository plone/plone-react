import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { PluggablesProvider, Pluggable, Plug } from './';
import config from '@plone/volto/registry';

global.__SERVER__ = true; // eslint-disable-line no-underscore-dangle

describe('<Pluggable /> in SSR', () => {
  it('passes params', () => {
    // Replicating the server.jsx setup
    config.transient.pluggables = {};
    config.transient.isFirstPass = true;

    // First pass
    renderToString(
      <PluggablesProvider>
        <Pluggable name="test" />
        <Plug pluggable="test" id="foo">
          HELLO
        </Plug>
      </PluggablesProvider>,
    );

    config.transient.isFirstPass = false;

    expect(config.transient.pluggables.test).toBeDefined();

    const markup = renderToString(
      <PluggablesProvider>
        <Pluggable name="test" />
        <Plug pluggable="test" id="foo">
          HELLO
        </Plug>
      </PluggablesProvider>,
    );
    expect(markup).toContain('HELLO');
  });
});
