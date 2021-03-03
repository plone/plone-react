/**
 * Summary view component.
 * @module components/theme/View/SummaryView
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

/**
 * Summary view component class.
 * @function SummaryView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const SummaryView = ({ content }) => (
  <Container className="view-wrapper">
    <article id="content">
      <header>
        <h1 className="documentFirstHeading">{content.title}</h1>
        {content.description && (
          <p className="documentDescription">{content.description}</p>
        )}
      </header>
      <section id="content-core">
        {content.items.map((item) => (
          <article key={item.url}>
            <h2>
              <Link to={item.url} title={item['@type']}>
                {item.title}
              </Link>
            </h2>
            {item.image && (
              <Image
                clearing
                floated="right"
                alt={item.image_caption ? item.image_caption : item.title}
                src={item.image.scales.thumb.download}
                loading="lazy"
              />
            )}
            {item.description && <p>{item.description}</p>}
            <p>
              <Link to={item.url}>
                <FormattedMessage id="Read More…" defaultMessage="Read More…" />
              </Link>
            </p>
          </article>
        ))}
      </section>
    </article>
  </Container>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
SummaryView.propTypes = {
  /**
   * Content of the object
   */
  content: PropTypes.shape({
    /**
     * Title of the object
     */
    title: PropTypes.string,
    /**
     * Description of the object
     */
    description: PropTypes.string,
    /**
     * Child items of the object
     */
    items: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Title of the item
         */
        title: PropTypes.string,
        /**
         * Description of the item
         */
        description: PropTypes.string,
        /**
         * Url of the item
         */
        url: PropTypes.string,
        /**
         * Image of the item
         */
        image: PropTypes.object,
        /**
         * Image caption of the item
         */
        image_caption: PropTypes.string,
        /**
         * Type of the item
         */
        '@type': PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default SummaryView;
