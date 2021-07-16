/**
 * Controlpanels component.
 * @module components/manage/Controlpanels/Controlpanels
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { concat, filter, last, map, uniqBy } from 'lodash';
import { Portal } from 'react-portal';
import { Helmet } from '@plone/volto/helpers';
import { Container, Grid, Header, Segment } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { listControlpanels, getSystemInformation } from '@plone/volto/actions';
import { Error, Icon, Toolbar, VersionOverview } from '@plone/volto/components';

import config from '@plone/volto/registry';

import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  sitesetup: {
    id: 'Site Setup',
    defaultMessage: 'Site Setup',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  versionoverview: {
    id: 'Version Overview',
    defaultMessage: 'Version Overview',
  },
  moderatecomments: {
    id: 'Moderate Comments',
    defaultMessage: 'Moderate Comments',
  },
  usersandgroups: {
    id: 'Users and Groups',
    defaultMessage: 'Users and Groups',
  },
  users: {
    id: 'Users',
    defaultMessage: 'Users',
  },
  groups: {
    id: 'Groups',
    defaultMessage: 'Groups',
  },
});

/**
 * Controlpanels container class.
 * @class Controlpanels
 * @extends Component
 */
class Controlpanels extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    listControlpanels: PropTypes.func.isRequired,
    controlpanels: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        group: PropTypes.string,
        title: PropTypes.string,
      }),
    ).isRequired,
    pathname: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs EditComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isClient: false,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.listControlpanels();
    this.props.getSystemInformation();
    this.setState({ isClient: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Error
    if (
      this.props.controlpanelsRequest.loading &&
      nextProps.controlpanelsRequest.error
    ) {
      this.setState({
        error: nextProps.controlpanelsRequest.error,
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    // Error
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }

    const controlpanels = map(
      concat(this.props.controlpanels, [
        {
          '@id': '/addons',
          group: 'General',
          title: 'Add-Ons',
        },
        {
          '@id': '/database',
          group: 'General',
          title: 'Database',
        },
        {
          '@id': '/moderate-comments',
          group: 'Content',
          title: this.props.intl.formatMessage(messages.moderatecomments),
        },
        {
          '@id': '/users',
          group: 'Users and Groups',
          title: this.props.intl.formatMessage(messages.users),
        },
        {
          '@id': '/groups',
          group: 'Users and Groups',
          title: this.props.intl.formatMessage(messages.groups),
        },
      ]),
      (controlpanel) => ({
        ...controlpanel,
        id: last(controlpanel['@id'].split('/')),
      }),
    );
    const groups = map(uniqBy(controlpanels, 'group'), 'group');
    const { controlPanelsIcons: icons } = config.settings;

    return (
      <div className="view-wrapper">
        <Helmet title={this.props.intl.formatMessage(messages.sitesetup)} />
        <Container className="controlpanel">
          <Segment.Group raised>
            <Segment className="primary">
              <FormattedMessage id="Site Setup" defaultMessage="Site Setup" />
            </Segment>
            {map(groups, (group) => [
              <Segment key={`header-${group}`} secondary>
                {group}
              </Segment>,
              <Segment key={`body-${group}`} attached>
                <Grid columns={6}>
                  <Grid.Row>
                    {map(filter(controlpanels, { group }), (controlpanel) => (
                      <Grid.Column key={controlpanel.id}>
                        <Link to={`/controlpanel/${controlpanel.id}`}>
                          <Header as="h3" icon textAlign="center">
                            <Icon
                              name={icons?.[controlpanel.id] || icons.default}
                              size="48px"
                            />
                            <Header.Content>
                              {controlpanel.title}
                            </Header.Content>
                          </Header>
                        </Link>
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </Segment>,
            ])}
          </Segment.Group>
          <Segment.Group raised>
            <Segment className="primary">
              <FormattedMessage
                id="Version Overview"
                defaultMessage="Version Overview"
              />
            </Segment>
            <Segment attached>
              {this.props.systemInformation ? (
                <VersionOverview {...this.props.systemInformation} />
              ) : null}
            </Segment>
          </Segment.Group>
        </Container>
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <Link to="/" className="item">
                  <Icon
                    name={backSVG}
                    className="contents circled"
                    size="30px"
                    title={this.props.intl.formatMessage(messages.back)}
                  />
                </Link>
              }
            />
          </Portal>
        )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      controlpanels: state.controlpanels.controlpanels,
      controlpanelsRequest: state.controlpanels.list,
      pathname: props.location.pathname,
      systemInformation: state.controlpanels.systeminformation,
    }),
    { listControlpanels, getSystemInformation },
  ),
)(Controlpanels);
