/**
 * View text block.
 * @module components/manage/Blocks/Text/View
 */

import PropTypes from 'prop-types';
import React from 'react';

import { settings } from '~/config';

import loadable from '@loadable/component';
const LibRedraft = loadable.lib(() => import('redraft'));

/**
 * View text block class.
 * @class View
 * @extends Component
 */
const View = ({ data }) => {
  return data.text ? (
    <LibRedraft>
      {({ default: redraft }) =>
        redraft(data.text, settings.ToHTMLRenderers, settings.ToHTMLOptions)
      }
    </LibRedraft>
  ) : (
    <br />
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
