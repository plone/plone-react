/**
 * Image view component.
 * @module components/theme/View/ImageView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import prettybytes from 'pretty-bytes';
import Image from '@plone/volto/components/theme/Image/Image';
import { flattenToAppURL } from '@plone/volto/helpers';

/**
 * Image view component class.
 * @function ImageView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const ImageView = ({ content }) => (
  <Container className="view-wrapper">
    <h1 className="documentFirstHeading">
      {content.title}
      {content.subtitle && ` - ${content.subtitle}`}
    </h1>
    {content.description && (
      <p className="documentDescription">{content.description}</p>
    )}
    {content?.image?.download && (
      <a href={flattenToAppURL(content.image.download)}>
        <Image image={content.image} size="preview" alt={content.title} />
        <figcaption>
          <FormattedMessage
            id="Size: {size}"
            defaultMessage="Size: {size}"
            values={{ size: prettybytes(content.image.size) }}
          />
          &nbsp; &mdash; &nbsp;
          <FormattedMessage
            id="Click to download full sized image"
            defaultMessage="Click to download full sized image"
          />
        </figcaption>
      </a>
    )}
  </Container>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ImageView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.shape({
      scales: PropTypes.shape({
        preview: PropTypes.shape({
          download: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
};

export default ImageView;
