/**
 * Toolbar component.
 * @module components/manage/Toolbar/Toolbar
 */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import cookie from 'react-cookie';
import { filter, find } from 'lodash';
import cx from 'classnames';

import More from '@plone/volto/components/manage/Toolbar/More';
import PersonalTools from '@plone/volto/components/manage/Toolbar/PersonalTools';
import Types from '@plone/volto/components/manage/Toolbar/Types';
import PersonalInformation from '@plone/volto/components/manage/Preferences/PersonalInformation';
import PersonalPreferences from '@plone/volto/components/manage/Preferences/PersonalPreferences';
import StandardWrapper from '@plone/volto/components/manage/Toolbar/StandardWrapper';
import {
  getTypes,
  listActions,
  setExpandedToolbar,
} from '@plone/volto/actions';
import { Icon } from '@plone/volto/components';
import { BodyClass, getBaseUrl } from '@plone/volto/helpers';

import pastanagaSmall from '@plone/volto/components/manage/Toolbar/pastanaga-small.svg';
import pastanagalogo from '@plone/volto/components/manage/Toolbar/pastanaga.svg';
import penSVG from '@plone/volto/icons/pen.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import addSVG from '@plone/volto/icons/add-document.svg';
import moreSVG from '@plone/volto/icons/more.svg';
import userSVG from '@plone/volto/icons/user.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import JoyRide, { STATUS } from 'react-joyride';
import { settings } from '~/config';

const messages = defineMessages({
  edit: {
    id: 'Edit',
    defaultMessage: 'Edit',
  },
  contents: {
    id: 'Contents',
    defaultMessage: 'Contents',
  },
  add: {
    id: 'Add',
    defaultMessage: 'Add',
  },
  more: {
    id: 'More',
    defaultMessage: 'More',
  },
  personalTools: {
    id: 'Personal tools',
    defaultMessage: 'Personal tools',
  },
  shrinkToolbar: {
    id: 'Shrink toolbar',
    defaultMessage: 'Shrink toolbar',
  },
  personalInformation: {
    id: 'Personal Information',
    defaultMessage: 'Personal Information',
  },
  personalPreferences: {
    id: 'Personal Preferences',
    defaultMessage: 'Personal Preferences',
  },
  collection: {
    id: 'Collection',
    defaultMessage: 'Collection',
  },
  file: {
    id: 'File',
    defaultMessage: 'File',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  newsItem: {
    id: 'News Item',
    defaultMessage: 'News Item',
  },
  page: {
    id: 'Page',
    defaultMessage: 'Page',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
});

const toolbarComponents = {
  personalTools: { component: PersonalTools, wrapper: null },
  more: { component: More, wrapper: null },
  types: { component: Types, wrapper: null, contentAsProps: true },
  profile: {
    component: PersonalInformation,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalInformation,
    hideToolbarBody: true,
  },
  preferences: {
    component: PersonalPreferences,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalPreferences,
    hideToolbarBody: true,
  },
};

/**
 * Toolbar container class.
 * @class Toolbar
 * @extends Component
 */
class Toolbar extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    content: PropTypes.shape({
      '@type': PropTypes.string,
      is_folderish: PropTypes.bool,
      review_state: PropTypes.string,
    }),
    getTypes: PropTypes.func.isRequired,
    types: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        addable: PropTypes.bool,
        title: PropTypes.string,
      }),
    ),
    listActions: PropTypes.func.isRequired,
    inner: PropTypes.element.isRequired,
    hideDefaultViewButtons: PropTypes.bool,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    token: null,
    content: null,
    hideDefaultViewButtons: false,
    types: [],
  };

  state = {
    expanded: cookie.load('toolbar_expanded') !== 'false',
    showMenu: false,
    menuStyle: {},
    menuComponents: [],
    loadedComponents: [],
    hideToolbarBody: false,
    run: cookie.load('guide') ? false : settings.guide,
  };

  steps = () => {
    return [
      {
        content: (
          <div>
            <h2>Click to edit page</h2>, You can interact with your own
            components through the spotlight.
            <br />
            Click the menu above!
          </div>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        placement: 'right',
        spotlightPadding: 20,
        target: '.edit',
      },
      {
        content: (
          <div>
            <h2>You can see the contents of your website</h2>, You can interact
            with your own components through the spotlight.
            <br />
            Click the menu above!
          </div>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        placement: 'right',
        spotlightPadding: 20,
        target: '.contents',
      },
      {
        content: (
          <div>
            <h2>Here we can add content</h2>, You can interact with your own
            components through the spotlight.
            <br />
            Click the menu above!
          </div>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 20,
        placement: 'right',
        target: '.add',
      },
      {
        content: (
          <div>
            <h2>You can see more</h2>, You can interact with your own components
            through the spotlight.
            <br />
            Click the menu above!
          </div>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 20,
        placement: 'right',
        target: '#toolbar-more',
      },
      {
        content: (
          <div>
            <h2>This is your controlPanels</h2>, You can interact with your own
            components through the spotlight.
            <br />
            Click the menu above!
          </div>
        ),
        floaterProps: {
          disableAnimation: true,
        },
        spotlightPadding: 20,
        placement: 'right',
        target: '#toolbar-personal',
      },
    ];
  };

  toolbarWindow = React.createRef();

  /**
   * Component will mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.listActions(getBaseUrl(this.props.pathname));
    this.props.getTypes(getBaseUrl(this.props.pathname));
    this.props.setExpandedToolbar(this.state.expanded);
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.listActions(getBaseUrl(nextProps.pathname));
      this.props.getTypes(getBaseUrl(nextProps.pathname));
    }
  }

  /**
   * Component will receive props
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  handleShrink = () => {
    cookie.save('toolbar_expanded', !this.state.expanded, {
      expires: new Date((2 ** 31 - 1) * 1000),
      path: '/',
    });
    this.setState(
      (state) => ({ expanded: !state.expanded }),
      () => this.props.setExpandedToolbar(this.state.expanded),
    );
  };

  closeMenu = () =>
    this.setState(() => ({ showMenu: false, loadedComponents: [] }));

  loadComponent = (type) => {
    const { loadedComponents } = this.state;
    if (!this.state.loadedComponents.includes(type)) {
      this.setState({
        loadedComponents: [...loadedComponents, type],
        hideToolbarBody: toolbarComponents[type].hideToolbarBody || false,
      });
    }
  };

  unloadComponent = () => {
    this.setState((state) => ({
      loadedComponents: state.loadedComponents.slice(0, -1),
      hideToolbarBody:
        toolbarComponents[
          state.loadedComponents[state.loadedComponents.length - 2]
        ].hideToolbarBody || false,
    }));
  };

  toggleMenu = (e, selector) => {
    if (this.state.showMenu) {
      this.closeMenu();
      return;
    }
    // PersonalTools always shows at bottom
    if (selector === 'personalTools') {
      this.setState((state) => ({
        showMenu: !state.showMenu,
        menuStyle: { bottom: 0 },
      }));
    } else {
      this.setState((state) => ({
        showMenu: !state.showMenu,
        menuStyle: { top: 0, overflow: 'initial' },
      }));
    }
    this.loadComponent(selector);
  };

  handleClickOutside = (e) => {
    if (this.pusher && doesNodeContainClick(this.pusher, e)) return;
    this.closeMenu();
  };

  handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      cookie.save('guide', 'true', {
        expires: new Date((2 ** 31 - 1) * 1000),
        path: '/',
      });
      this.setState({ run: false });
    }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const path = getBaseUrl(this.props.pathname);
    const editAction = find(this.props.actions.object, { id: 'edit' });
    const folderContentsAction = find(this.props.actions.object, {
      id: 'folderContents',
    });
    const { expanded, run } = this.state;

    return (
      this.props.token && (
        <>
          <BodyClass
            className={expanded ? 'has-toolbar' : 'has-toolbar-collapsed'}
          />
          <div
            style={this.state.menuStyle}
            className={
              this.state.showMenu ? 'toolbar-content show' : 'toolbar-content'
            }
            ref={this.toolbarWindow}
          >
            {this.state.showMenu && (
              // This sets the scroll locker in the body tag in mobile
              <BodyClass className="has-toolbar-menu-open" />
            )}
            <div
              className="pusher-puller"
              ref={(node) => (this.pusher = node)}
              style={{
                transform: this.toolbarWindow.current
                  ? `translateX(-${
                      (this.state.loadedComponents.length - 1) *
                      this.toolbarWindow.current.getBoundingClientRect().width
                    }px)`
                  : null,
              }}
            >
              {this.state.loadedComponents.map((component, index) =>
                (() => {
                  const ToolbarComponent =
                    toolbarComponents[component].component;
                  const WrapperComponent = toolbarComponents[component].wrapper;
                  const haveActions =
                    toolbarComponents[component].hideToolbarBody;
                  const title =
                    toolbarComponents[component].wrapperTitle &&
                    this.props.intl.formatMessage(
                      toolbarComponents[component].wrapperTitle,
                    );
                  if (WrapperComponent) {
                    return (
                      <WrapperComponent
                        componentName={component}
                        componentTitle={title}
                        pathname={this.props.pathname}
                        loadComponent={this.loadComponent}
                        unloadComponent={this.unloadComponent}
                        componentIndex={index}
                        theToolbar={this.theToolbar}
                        key={`personalToolsComponent-${index}`}
                        closeMenu={this.closeMenu}
                        hasActions={haveActions}
                      >
                        <ToolbarComponent
                          pathname={this.props.pathname}
                          loadComponent={this.loadComponent}
                          unloadComponent={this.unloadComponent}
                          componentIndex={index}
                          theToolbar={this.theToolbar}
                          closeMenu={this.closeMenu}
                          isToolbarEmbedded
                        />
                      </WrapperComponent>
                    );
                  } else {
                    return (
                      <ToolbarComponent
                        pathname={this.props.pathname}
                        loadComponent={this.loadComponent}
                        unloadComponent={this.unloadComponent}
                        componentIndex={index}
                        theToolbar={this.theToolbar}
                        key={`personalToolsComponent-${index}`}
                        closeMenu={this.closeMenu}
                        content={
                          toolbarComponents[component].contentAsProps
                            ? this.props.content
                            : null
                        }
                      />
                    );
                  }
                })(),
              )}
            </div>
          </div>
          <div className={this.state.expanded ? 'toolbar expanded' : 'toolbar'}>
            <div className="toolbar-body">
              <div className="toolbar-actions">
                <div>
                  <JoyRide
                    steps={this.steps()}
                    continuous={true}
                    showSkipButton={true}
                    run={run}
                    styles={{
                      tooltipContainer: {
                        textAlign: 'left',
                      },
                      buttonNext: {
                        backgroundColor: 'green',
                      },
                      buttonBack: {
                        marginRight: 400,
                      },
                    }}
                    callback={this.handleJoyrideCallback}
                  />
                </div>
                {this.props.hideDefaultViewButtons && this.props.inner && (
                  <>{this.props.inner}</>
                )}
                {!this.props.hideDefaultViewButtons && (
                  <>
                    {editAction && (
                      <Link
                        aria-label={this.props.intl.formatMessage(
                          messages.edit,
                        )}
                        className="edit"
                        to={`${path}/edit`}
                      >
                        <Icon name={penSVG} size="30px" className="circled" />
                      </Link>
                    )}
                    {this.props.content &&
                      this.props.content.is_folderish &&
                      folderContentsAction &&
                      !this.props.pathname.endsWith('/contents') && (
                        <Link
                          aria-label={this.props.intl.formatMessage(
                            messages.contents,
                          )}
                          to={`${path}/contents`}
                          className="contents"
                        >
                          <Icon name={folderSVG} size="30px" />
                        </Link>
                      )}
                    {this.props.content &&
                      this.props.content.is_folderish &&
                      folderContentsAction &&
                      this.props.pathname.endsWith('/contents') && (
                        <Link
                          to={`${path}`}
                          aria-label={this.props.intl.formatMessage(
                            messages.back,
                          )}
                        >
                          <Icon
                            name={clearSVG}
                            className="contents circled"
                            size="30px"
                            title={this.props.intl.formatMessage(messages.back)}
                          />
                        </Link>
                      )}
                    {this.props.content &&
                      this.props.content.is_folderish &&
                      this.props.types.length > 0 && (
                        <button
                          className="add"
                          aria-label={this.props.intl.formatMessage(
                            messages.add,
                          )}
                          onClick={(e) => this.toggleMenu(e, 'types')}
                          tabIndex={0}
                          id="toolbar-add"
                        >
                          <Icon name={addSVG} size="30px" />
                        </button>
                      )}
                    <div className="toolbar-button-spacer" />
                    <button
                      className="more"
                      aria-label={this.props.intl.formatMessage(messages.more)}
                      onClick={(e) => this.toggleMenu(e, 'more')}
                      tabIndex={0}
                      id="toolbar-more"
                    >
                      <Icon
                        className="mobile hidden"
                        name={moreSVG}
                        size="30px"
                      />
                      {this.state.showMenu ? (
                        <Icon
                          className="mobile only"
                          name={clearSVG}
                          size="30px"
                        />
                      ) : (
                        <Icon
                          className="mobile only"
                          name={moreSVG}
                          size="30px"
                        />
                      )}
                    </button>
                  </>
                )}
              </div>
              <div className="toolbar-bottom">
                <img className="minipastanaga" src={pastanagaSmall} alt="" />
                {!this.props.hideDefaultViewButtons && (
                  <button
                    className="user"
                    aria-label={this.props.intl.formatMessage(
                      messages.personalTools,
                    )}
                    onClick={(e) => this.toggleMenu(e, 'personalTools')}
                    tabIndex={0}
                    id="toolbar-personal"
                  >
                    <Icon name={userSVG} size="30px" />
                  </button>
                )}
                <div className="divider" />
                <div className="pastanagalogo">
                  <img src={pastanagalogo} alt="" />
                </div>
              </div>
            </div>
            <div className="toolbar-handler">
              <button
                aria-label={this.props.intl.formatMessage(
                  messages.shrinkToolbar,
                )}
                className={cx({
                  [this.props.content?.review_state]: this.props.content
                    ?.review_state,
                })}
                onClick={this.handleShrink}
              />
            </div>
          </div>
          <div className="pusher" />
        </>
      )
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      token: state.userSession.token,
      content: state.content.data,
      pathname: props.pathname,
      types: filter(state.types.types, 'addable'),
    }),
    { getTypes, listActions, setExpandedToolbar },
  ),
)(Toolbar);
