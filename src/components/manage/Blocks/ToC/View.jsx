/**
 * View toc block.
 * @module components/manage/Blocks/ToC/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { map } from 'lodash';
import { List } from 'semantic-ui-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { blocks } from '~/config';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
} from '@plone/volto/helpers';

/**
 * View toc block class.
 * @class View
 * @extends Component
 */
const View = ({ properties, data }) => {
  const blocksFieldname = getBlocksFieldname(properties);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(properties);
  const tocEntries = map(properties[blocksLayoutFieldname].items, (id) => {
    const block = properties[blocksFieldname][id];
    return blocks.blocksConfig[block['@type']]?.tocEntry
      ? blocks.blocksConfig[block['@type']]?.tocEntry(block)
      : null;
  });

  return (
    <div className="block table-of-contents">
      <h2>
        <FormattedMessage
          id="Table of Contents"
          defaultMessage="Table of Contents"
        />
      </h2>
      <List bulleted>
        {map(
          tocEntries,
          (entry) =>
            entry && (
              <List.Item key={entry.id} className={entry.level}>
                <AnchorLink href={`#${entry.id}`}>{entry.text}</AnchorLink>
              </List.Item>
            ),
        )}
      </List>
    </div>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default injectIntl(View);
