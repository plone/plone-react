/**
 * View Proxy tile.
 * @module components/manage/Tiles/Proxy/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import { Image, Item } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { settings } from '~/config';

import { getContent, resetContent } from '../../../../actions';

/**
 * Proxy view component.
 * @class View
 * @extends Component
 */
export class View extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    tile: PropTypes.string.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    getContent: PropTypes.func.isRequired,
    resetContent: PropTypes.func.isRequired,
    contentSubrequests: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    contentSubrequests: {},
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { selectedItem } = this.props.data;
    if (selectedItem) {
      // Use subrequests to fetch tile data
      this.props.getContent(selectedItem, undefined, this.props.tile);
    }
  }

  /**
   * Component will unmount. Reset loaded content.
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    this.props.resetContent(this.props.tile);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { contentSubrequests, tile } = this.props;
    const selectedItem = get(this.props, 'data.selectedItem', '');

    // Using null as default for consistency with content reducer
    // see reducers/content/content.js, look for action GET_CONTENT_PENDING
    const data = get(contentSubrequests, [tile, 'data'], null);
    if (data && Object.keys(data).length) {
      const image = get(data, 'image.scales.mini.download', '').replace(
        settings.apiPath,
        '',
      );

      return (
        <Item.Group className="proxy-item">
          <Item>
            {image && (
              <Link to={selectedItem} className="ui small image">
                <Image src={image} alt={data.title} />
              </Link>
            )}
            <Item.Content>
              <Item.Header>
                <Link to={selectedItem}>{data.title}</Link>
              </Item.Header>
              <Item.Description>{data.description}</Item.Description>
            </Item.Content>
          </Item>
        </Item.Group>
      );
    }
    return null;
  }
}

export default connect(
  state => ({
    contentSubrequests: state.content.subrequests,
  }),
  dispatch =>
    bindActionCreators(
      {
        getContent,
        resetContent,
      },
      dispatch,
    ),
)(View);
