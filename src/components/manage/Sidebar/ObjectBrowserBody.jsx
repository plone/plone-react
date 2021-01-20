import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Input, Segment } from 'semantic-ui-react';
import { join } from 'lodash';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';

// These absolute imports (without using the corresponding centralized index.js) are required
// to cut circular import problems, this file should never use them. This is because of
// the very nature of the functionality of the component and its relationship with others
import { searchContent } from '@plone/volto/actions/search/search';
import Icon from '@plone/volto/components/theme/Icon/Icon';
import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers/Url/Url';

import { settings } from '~/config';
import backSVG from '@plone/volto/icons/back.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import searchSVG from '@plone/volto/icons/zoom.svg';
import linkSVG from '@plone/volto/icons/link.svg';

import ObjectBrowserNav from '@plone/volto/components/manage/Sidebar/ObjectBrowserNav';

const messages = defineMessages({
  SearchInputPlaceholder: {
    id: 'Search content',
    defaultMessage: 'Search content',
  },
  SelectedItems: {
    id: 'Selected items',
    defaultMessage: 'Selected items',
  },
  of: { id: 'Selected items - x of y', defaultMessage: 'of' },
});

export function getParentURL(url) {
  return flattenToAppURL(`${join(url.split('/').slice(0, -1), '/')}`) || '/';
}

/**
 * ObjectBrowserBody container class.
 * @class ObjectBrowserBody
 * @extends Component
 */
class ObjectBrowserBody extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    block: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    searchSubrequests: PropTypes.objectOf(PropTypes.any).isRequired,
    searchContent: PropTypes.func.isRequired,
    closeObjectBrowser: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onSelectItem: PropTypes.func,
    dataName: PropTypes.string,
    maximumSelectionSize: PropTypes.number,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    image: '',
    href: '',
    onSelectItem: null,
    dataName: null,
    selectableTypes: [],
    maximumSelectionSize: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      currentFolder:
        this.props.mode === 'multiple'
          ? '/'
          : this.props.data?.contextURL
          ? getParentURL(this.props.data.contextURL)
          : '/',
      currentImageFolder:
        this.props.mode === 'multiple'
          ? '/'
          : this.props.data?.url
          ? getParentURL(this.props.data.url)
          : '/',
      currentLinkFolder:
        this.props.mode === 'multiple'
          ? '/'
          : this.props.data?.href
          ? getParentURL(this.props.data.href)
          : '/',
      parentFolder: '',
      selectedImage:
        this.props.mode === 'multiple'
          ? ''
          : this.props.data?.url
          ? flattenToAppURL(this.props.data.url)
          : '',
      selectedHref:
        this.props.mode === 'multiple'
          ? ''
          : this.props.data?.href
          ? flattenToAppURL(this.props.data.href)
          : '',
      showSearchInput: false,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
    this.initialSearch(this.props.mode);
  }

  /**
   * Component will receive props
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  initialSearch = (mode) => {
    const currentSelected =
      mode === 'multiple'
        ? ''
        : mode === 'image'
        ? this.state.selectedImage
        : this.state.selectedHref;
    if (currentSelected && isInternalURL(currentSelected)) {
      this.props.searchContent(
        getParentURL(currentSelected),
        {
          'path.depth': 1,
          sort_on: 'getObjPositionInParent',
          metadata_fields: '_all',
          b_size: 1000,
        },
        `${this.props.block}-${mode}`,
      );
    } else {
      this.props.searchContent(
        this.state.currentFolder,
        {
          'path.depth': 1,
          sort_on: 'getObjPositionInParent',
          metadata_fields: '_all',
          b_size: 1000,
        },
        `${this.props.block}-${mode}`,
      );
    }
  };

  handleClickOutside = (e) => {
    if (
      this.objectBrowser &&
      doesNodeContainClick(this.objectBrowser.current, e)
    )
      return;
    this.props.closeObjectBrowser();
  };

  objectBrowser = React.createRef();

  navigateTo = (id) => {
    this.props.searchContent(
      id,
      {
        'path.depth': 1,
        sort_on: 'getObjPositionInParent',
        metadata_fields: '_all',
        b_size: 1000,
      },
      `${this.props.block}-${this.props.mode}`,
    );
    const parent = `${join(id.split('/').slice(0, -1), '/')}` || '/';
    this.setState(() => ({
      parentFolder: parent,
      currentFolder: id || '/',
    }));
  };

  toggleSearchInput = () =>
    this.setState((prevState) => ({
      showSearchInput: !prevState.showSearchInput,
    }));

  onSearch = (e) => {
    const text = e.target.value;
    text.length > 2
      ? this.props.searchContent(
          '/',
          {
            SearchableText: `${text}*`,
            metadata_fields: '_all',
          },
          `${this.props.block}-${this.props.mode}`,
        )
      : this.props.searchContent(
          '/',
          {
            'path.depth': 1,
            sort_on: 'getObjPositionInParent',
            metadata_fields: '_all',
          },
          `${this.props.block}-${this.props.mode}`,
        );
  };

  onSelectItem = (item) => {
    const url = item['@id'];
    const title = item.title;
    const { block, data, mode, dataName, onChangeBlock } = this.props;

    const updateState = (mode) => {
      switch (mode) {
        case 'image':
          this.setState({
            selectedImage: url,
            currentImageFolder: getParentURL(url),
          });
          break;
        case 'link':
          this.setState({
            selectedHref: url,
            currentLinkFolder: getParentURL(url),
          });
          break;
        default:
          break;
      }
    };

    if (dataName) {
      onChangeBlock(block, {
        ...data,
        [dataName]: url,
      });
    } else if (this.props.onSelectItem) {
      this.props.onSelectItem(url, item);
    } else if (mode === 'image') {
      onChangeBlock(block, {
        ...data,
        url: item.getURL,
        alt: title,
      });
    } else if (mode === 'link') {
      onChangeBlock(block, {
        ...data,
        href: url,
      });
    }
    updateState(mode);
  };

  onChangeBlockData = (key, value) => {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      [key]: value,
    });
  };

  isSelectable = (item) => {
    return this.props.selectableTypes.length > 0
      ? this.props.selectableTypes.indexOf(item['@type']) >= 0
      : true;
  };

  handleClickOnItem = (item) => {
    if (this.props.mode === 'image') {
      if (item.is_folderish) {
        this.navigateTo(item['@id']);
      }
      if (settings.imageObjects.includes(item['@type'])) {
        this.onSelectItem(item);
      }
    } else {
      if (this.isSelectable(item)) {
        if (
          !this.props.maximumSelectionSize ||
          !this.props.data ||
          this.props.data.length < this.props.maximumSelectionSize
        ) {
          this.onSelectItem(item);
          let length = this.props.data ? this.props.data.length : 0;
          if (length + 1 >= this.props.maximumSelectionSize) {
            this.props.closeObjectBrowser();
          }
        } else {
          this.props.closeObjectBrowser();
        }
      } else {
        this.navigateTo(item['@id']);
      }
    }
  };

  handleDoubleClickOnItem = (item) => {
    if (this.props.mode === 'image') {
      if (item.is_folderish) {
        this.navigateTo(item['@id']);
      }
      if (settings.imageObjects.includes(item['@type'])) {
        this.onSelectItem(item);
        this.props.closeObjectBrowser();
      }
    } else {
      if (this.isSelectable(item)) {
        if (this.props.data.length < this.props.maximumSelectionSize) {
          this.onSelectItem(item);
        }
        this.props.closeObjectBrowser();
      } else {
        this.navigateTo(item['@id']);
      }
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return ReactDOM.createPortal(
      <aside
        role="presentation"
        onClick={(e) => {
          e.stopPropagation();
        }}
        ref={this.objectBrowser}
        key="objectbrowsercontainerkey"
        className="sidebar-container"
      >
        <Segment.Group raised>
          <header className="header pulled">
            <div className="vertical divider" />
            {this.state.currentFolder === '/' ? (
              <>
                {this.props.mode === 'image' ? (
                  <Icon name={folderSVG} size="24px" />
                ) : (
                  <Icon name={linkSVG} size="24px" />
                )}
              </>
            ) : (
              <Icon
                name={backSVG}
                size="24px"
                onClick={() => this.navigateTo(this.state.parentFolder)}
              />
            )}
            {this.state.showSearchInput ? (
              <Input
                className="search"
                onChange={this.onSearch}
                placeholder={this.props.intl.formatMessage(
                  messages.SearchInputPlaceholder,
                )}
              />
            ) : this.props.mode === 'image' ? (
              <h2>
                <FormattedMessage
                  id="Choose Image"
                  className="choose-image"
                  defaultMessage="Choose Image"
                />
              </h2>
            ) : (
              <h2>
                <FormattedMessage
                  id="Choose Target"
                  className="choose-target"
                  defaultMessage="Choose Target"
                />
              </h2>
            )}

            <button onClick={this.toggleSearchInput}>
              <Icon
                name={searchSVG}
                className="search-object-browser"
                size="24px"
              />
            </button>
            <button onClick={this.props.closeObjectBrowser}>
              <Icon
                name={clearSVG}
                className="close-object-browser"
                size="24px"
              />
            </button>
          </header>
          <Segment secondary>{this.state.currentFolder}</Segment>
          {this.props.mode === 'multiple' && (
            <Segment className="infos">
              {this.props.intl.formatMessage(messages.SelectedItems)}:{' '}
              {this.props.data?.length}
              {this.props.maximumSelectionSize && (
                <>
                  {' '}
                  {this.props.intl.formatMessage(messages.of)}{' '}
                  {this.props.maximumSelectionSize}
                </>
              )}
            </Segment>
          )}
          <ObjectBrowserNav
            currentSearchResults={
              this.props.searchSubrequests[
                `${this.props.block}-${this.props.mode}`
              ]
            }
            selected={
              this.props.mode === 'multiple'
                ? this.props.data
                : [
                    {
                      '@id':
                        this.props.mode === 'image'
                          ? this.state.selectedImage
                          : this.state.selectedHref,
                    },
                  ]
            }
            handleClickOnItem={this.handleClickOnItem}
            handleDoubleClickOnItem={this.handleDoubleClickOnItem}
            mode={this.props.mode}
            navigateTo={this.navigateTo}
            isSelectable={this.isSelectable}
          />
        </Segment.Group>
      </aside>,
      document.body,
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      searchSubrequests: state.search.subrequests,
    }),
    { searchContent },
  ),
)(ObjectBrowserBody);
