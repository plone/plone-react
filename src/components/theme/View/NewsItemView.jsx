/**
 * NewsItemView view component.
 * @module components/theme/View/NewsItemView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Image } from 'semantic-ui-react';

import { flattenToAppURL, flattenHTMLToAppURL } from '@plone/volto/helpers';

/**
 * NewsItemView view component class.
 * @function NewsItemView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const NewsItemView = ({ content }) => (
  <Container className="view-wrapper">
    {content.title && (
      <h1 className="documentFirstHeading">
        {content.title}
        {content.subtitle && ` - ${content.subtitle}`}
      </h1>
    )}
    {content.description && (
      <p className="documentDescription">{content.description}</p>
    )}
    {content.image && (
      <Image
        className="documentImage"
        alt={content.title}
        title={content.title}
        src={
          content.image['content-type'] === 'image/svg+xml'
            ? flattenToAppURL(content.image.download)
            : flattenToAppURL(content.image.scales.mini.download)
        }
        floated="right"
        loading="lazy"
      />
    )}
    {content.text && (
      <div
        dangerouslySetInnerHTML={{
          __html: flattenHTMLToAppURL(content.text.data),
        }}
      />
    )}
  </Container>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
NewsItemView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.shape({
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default NewsItemView;
