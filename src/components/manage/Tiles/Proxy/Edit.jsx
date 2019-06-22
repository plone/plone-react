/**
 * Edit Proxy tile.
 * @module components/manage/Tiles/Proxy/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Item, Dropdown, Ref } from 'semantic-ui-react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { map, sortBy, get } from 'lodash';
import cx from 'classnames';

import { settings } from '~/config';

import {
  getContent,
  searchContent,
  resetContent,
  resetSearchContent,
} from '../../../../actions';

const messages = defineMessages({
  no_results_found: {
    id: 'No results found.',
    defaultMessage: 'No results found.',
  },
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
});

@injectIntl
@connect(
  state => ({
    contentSubrequests: state.content.subrequests,
    searchSubrequests: state.search.subrequests,
  }),
  dispatch =>
    bindActionCreators(
      {
        getContent,
        searchContent,
        resetContent,
        resetSearchContent,
      },
      dispatch,
    ),
)
/**
 * Edit text tile class.
 * @class Edit
 * @extends Component
 */
export default class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    selected: PropTypes.bool.isRequired,
    tile: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    intl: intlShape.isRequired,
    onChangeTile: PropTypes.func.isRequired,
    onSelectTile: PropTypes.func.isRequired,
    onDeleteTile: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    getContent: PropTypes.func.isRequired,
    searchContent: PropTypes.func.isRequired,
    resetContent: PropTypes.func.isRequired,
    resetSearchContent: PropTypes.func.isRequired,
    searchSubrequests: PropTypes.objectOf(PropTypes.any),
    contentSubrequests: PropTypes.objectOf(PropTypes.any),
  };

  static defaultProps = {
    contentSubrequests: {},
    searchSubrequests: [],
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { resetSearchContent, selected, tile } = this.props;
    if (selected) {
      this.dropdownRef.querySelector('input.search').focus();
    }
    resetSearchContent(tile);
    this.updateContent();
  }

  /**
   * Component did update. Here we fetch new content if needed.
   * @method componentDidUpdate
   * @param {Object} prevProps Props before update
   * @param {Object} prevState State before update
   * @returns {undefined}
   */
  componentDidUpdate(prevProps) {
    if (!prevProps.selected && this.props.selected && this.dropdownRef) {
      this.dropdownRef.querySelector('input.search').focus();
    }
    if (prevProps.data.selectedItem !== this.props.data.selectedItem) {
      this.updateContent();
    }
  }

  /**
   * Component will unmount. Reset loaded content.
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    this.props.resetSearchContent(this.props.tile);
    this.props.resetContent(this.props.tile);
  }

  /**
   * Change handler
   * @method onChange
   * @param {string} value Value
   * @returns {undefined}
   */
  onChange = value => {
    if (value) {
      this.props.searchContent(
        '',
        {
          Title: `*${value}*`,
        },
        this.props.tile,
      );
    } else {
      this.props.resetSearchContent(this.props.tile);
    }
  };

  /**
   * Select item handler
   * @method onSelectItem
   * @param {string} value Search term
   * @returns {undefined}
   */
  onSelectItem = value => {
    this.props.onChangeTile(this.props.tile, {
      ...this.props.data,
      selectedItem: value,
    });
  };

  /**
   * Fetches proxied content.
   * @method updateContent
   * @returns {undefined}
   */
  updateContent = () => {
    const { selectedItem } = this.props.data;
    if (selectedItem) {
      // Use subrequests to fetch tile data
      this.props.getContent(selectedItem, undefined, this.props.tile);
    }
  };

  /**
   * Sets reference to the dropdown element in order to auto-focus it
   * @method handleDropdownRef
   * @param {node} node Dropdown element
   * @returns {undefined}
   */
  handleDropdownRef = node => {
    this.dropdownRef = node;
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }
    const {
      contentSubrequests,
      intl,
      onSelectTile,
      searchSubrequests,
      selected,
      tile,
    } = this.props;

    // Using null as default for consistency with content reducer
    // see reducers/content/content.js, look for action GET_CONTENT_PENDING
    const contentData = get(contentSubrequests, [tile, 'data'], null);
    const image = get(contentData, 'image.scales.mini.download', '').replace(
      settings.apiPath,
      '',
    );

    // the default for items in the search reducers is [] instead
    // see reducers/search/search.js
    const searchItems = get(searchSubrequests, [tile, 'items'], []);

    return (
      <div
        role="presentation"
        onClick={() => onSelectTile(tile)}
        className={cx('tile proxy', {
          selected,
        })}
        tabIndex={0}
        onKeyDown={e =>
          this.props.handleKeyDown(
            e,
            this.props.index,
            this.props.tile,
            this.node,
          )
        }
        ref={node => {
          this.node = node;
        }}
      >
        {/* Widget that searches for a reference */}
        {selected && (
          <div className="toolbar" style={{ width: '400px' }}>
            <Ref innerRef={this.handleDropdownRef}>
              <Dropdown
                options={sortBy(
                  map(searchItems, result => ({
                    key: result['@id'],
                    value: result['@id'],
                    text: result.title,
                  })),
                  'text',
                )}
                placeholder={intl.formatMessage(messages.search)}
                search
                selection
                selectOnBlur={false}
                selectOnNavigation={false}
                fluid
                noResultsMessage={intl.formatMessage(messages.no_results_found)}
                onChange={(event, data) => this.onSelectItem(data.value)}
                onSearchChange={(event, data) =>
                  this.onChange(data.searchQuery)
                }
              />
            </Ref>
          </div>
        )}
        {/* Show selected item */}
        {contentData && Object.keys(contentData).length > 0 && (
          <Item.Group>
            <Item>
              {image && <Item.Image src={image} alt={contentData.title} />}
              <Item.Content>
                <Item.Header>{contentData.title}</Item.Header>
                <Item.Description>{contentData.description}</Item.Description>
              </Item.Content>
            </Item>
          </Item.Group>
        )}
      </div>
    );
  }
}
