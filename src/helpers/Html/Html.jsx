/**
 * Html helper.
 * @module helpers/Html
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import serialize from 'serialize-javascript';
import { join } from 'lodash';
import { BodyClass } from '../.';

/**
 * Html class.
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 * @function Html
 * @param {Object} props Component properties.
 * @param {Object} props.assets Assets to be rendered.
 * @param {Object} props.component Content to be rendered as child node.
 * @param {Object} props.store Store object.
 * @returns {string} Markup of the not found page.
 */

/**
 * Html class.
 * @class Html
 * @extends Component
 */
class Html extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    assets: PropTypes.shape({
      styles: PropTypes.object,
      javascript: PropTypes.shape({
        main: PropTypes.string,
      }),
    }).isRequired,
    markup: PropTypes.string.isRequired,
    store: PropTypes.shape({
      getState: PropTypes.func,
    }).isRequired,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { assets, markup, store } = this.props;
    const head = Helmet.rewind();
    const bodyClass = join(BodyClass.rewind(), ' ');

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          {assets.client.css ? (
            <link rel="stylesheet" href={assets.client.css} />
          ) : null}
          {process.env.NODE_ENV === 'production' ? (
            <script src={assets.client.js} defer />
          ) : (
            <script src={assets.client.js} defer crossOrigin="true" />
          )}
        </head>
        <body className={bodyClass}>
          <div role="navigation" aria-label="Toolbar" id="toolbar" />
          <div id="main" dangerouslySetInnerHTML={{ __html: markup }} />
          <div id="sidebar" />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__data=${serialize(store.getState())};`,
            }}
            charSet="UTF-8"
          />
        </body>
      </html>
    );
  }
}

export default Html;
