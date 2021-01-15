import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import redraft from 'redraft';
import { settings } from '~/config';

const mockStore = configureStore();

function toHTML(data) {
  return ReactDOMServer.renderToStaticMarkup(
    <Provider
      store={mockStore({
        userSession: {
          token: 'jfhgfhfh',
        },
      })}
    >
      <MemoryRouter>
        {redraft(data, settings.ToHTMLRenderers, settings.ToHTMLOptions)}
      </MemoryRouter>
    </Provider>,
  );
}

describe('Basic from draftJS to HTML', () => {
  it('can render a basic paragraph', () => {
    const data = {
      blocks: [
        {
          key: 'bb320',
          text: 'This is text',
          type: 'unstyled',
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    };
    expect(toHTML(data)).toBe('<p>This is text</p>');
  });
});
