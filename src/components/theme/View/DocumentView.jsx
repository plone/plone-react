/**
 * Document view component.
 * @module components/theme/View/DocumentView
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Container, Image } from 'semantic-ui-react';
import { map } from 'lodash';

import {
  ViewTitleTile,
  ViewDescriptionTile,
  ViewTextTile,
  ViewImageTile,
  ViewVideoTile,
} from '../../../components';
import {
  getTilesFieldname,
  getTilesLayoutFieldname,
  hasTilesData,
} from '../../../helpers';
import { settings } from '~/config';

/**
 * Component to display the document view.
 * @function DocumentView
 * @param {Object} content Content object.
 * @returns {string} Markup of the component.
 */
const DocumentView = ({ content }) => {
  const tilesFieldname = getTilesFieldname(content);
  const tilesLayoutFieldname = getTilesLayoutFieldname(content);

  return hasTilesData(content) ? (
    <div id="page-document" className="ui wrapper">
      <Helmet title={content.title} />
      {map(content[tilesLayoutFieldname].items, tile => {
        let Tile = null;
        switch (content[tilesFieldname][tile]['@type']) {
          case 'title':
            Tile = ViewTitleTile;
            break;
          case 'description':
            Tile = ViewDescriptionTile;
            break;
          case 'text':
            Tile = ViewTextTile;
            break;
          case 'image':
            Tile = ViewImageTile;
            break;
          case 'video':
            Tile = ViewVideoTile;
            break;
          default:
            break;
        }
        return Tile !== null ? (
          <Tile
            key={tile}
            properties={content}
            data={content[tilesFieldname][tile]}
          />
        ) : (
          <div>{JSON.stringify(content[tilesFieldname][tile]['@type'])}</div>
        );
      })}
    </div>
  ) : (
    <Container id="page-document">
      <Helmet title={content.title} />
      <h1 className="documentFirstHeading">{content.title}</h1>
      {content.description && (
        <p className="documentDescription">{content.description}</p>
      )}
      {content.image && (
        <Image
          className="document-image"
          src={content.image.scales.thumb.download}
          floated="right"
        />
      )}
      {content.text && (
        <p dangerouslySetInnerHTML={{ __html: content.text.data.replace(/a href=\"([^"]*\.[^"]*)\"/g, `a href="${settings.apiPath}$1/download/file"`) }} />
      )}
    </Container>
  );

};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
DocumentView.propTypes = {
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
     * Text of the object
     */
    text: PropTypes.shape({
      /**
       * Data of the text of the object
       */
      data: PropTypes.string,
    }),
  }).isRequired,
};

export default DocumentView;
