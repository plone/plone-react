/**
 * History component.
 * @module components/manage/History/History
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Container, Dropdown, Icon, Segment, Table } from 'semantic-ui-react';
import { concat, map, reverse } from 'lodash';
import { Portal } from 'react-portal';
import moment from 'moment';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { Icon as IconNext, Toolbar } from '@plone/volto/components';
import { getHistory, revertHistory } from '@plone/volto/actions';
import { getBaseUrl } from '@plone/volto/helpers';

import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  history: {
    id: 'History',
    defaultMessage: 'History',
  },
});

/**
 * History class.
 * @class History
 * @extends Component
 */
class History extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getHistory: PropTypes.func.isRequired,
    revertHistory: PropTypes.func.isRequired,
    revertRequest: PropTypes.shape({
      loaded: PropTypes.bool,
      loading: PropTypes.bool,
    }).isRequired,
    pathname: PropTypes.string.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        transition_title: PropTypes.string,
        type: PropTypes.string,
        action: PropTypes.string,
        state_title: PropTypes.string,
        time: PropTypes.string,
        comments: PropTypes.string,
        actor: PropTypes.shape({ fullname: PropTypes.string }),
      }),
    ).isRequired,
    title: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Workflow
   */
  constructor(props) {
    super(props);
    this.onRevert = this.onRevert.bind(this);
    this.state = { isClient: false };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getHistory(getBaseUrl(this.props.pathname));
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.revertRequest.loading && nextProps.revertRequest.loaded) {
      this.props.getHistory(getBaseUrl(this.props.pathname));
    }
  }

  /**
   * On revert
   * @method onRevert
   * @param {object} event Event object
   * @param {number} value Value
   * @returns {undefined}
   */
  onRevert(event, { value }) {
    this.props.revertHistory(getBaseUrl(this.props.pathname), value);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const entries = reverse(concat(this.props.entries));
    let title = entries.length > 0 ? entries[0].state_title : '';
    for (let x = 1; x < entries.length; x += 1) {
      entries[x].prev_state_title = title;
      title = entries[x].state_title || title;
    }
    reverse(entries);
    return (
      <Container id="page-history">
        <Helmet title={this.props.intl.formatMessage(messages.history)} />
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage
              id="History of {title}"
              defaultMessage="History of {title}"
              values={{
                title: <q>{this.props.title}</q>,
              }}
            />
          </Segment>
          <Segment secondary>
            <FormattedMessage
              id="You can view the history of your item below."
              defaultMessage="You can view the history of your item below."
            />
          </Segment>
          <Table selectable compact singleLine attached>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4}>
                  <FormattedMessage id="What" defaultMessage="What" />
                </Table.HeaderCell>
                <Table.HeaderCell width={4}>
                  <FormattedMessage id="Who" defaultMessage="Who" />
                </Table.HeaderCell>
                <Table.HeaderCell width={4}>
                  <FormattedMessage id="When" defaultMessage="When" />
                </Table.HeaderCell>
                <Table.HeaderCell width={4}>
                  <FormattedMessage
                    id="Change Note"
                    defaultMessage="Change Note"
                  />
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {map(entries, (entry) => (
                <Table.Row key={entry.time}>
                  <Table.Cell>
                    {('version' in entry && entry.version > 0 && (
                      <Link
                        className="item"
                        to={`${getBaseUrl(this.props.pathname)}/diff?one=${
                          entry.version - 1
                        }&two=${entry.version}`}
                      >
                        {entry.transition_title}
                      </Link>
                    )) || (
                      <span>
                        {entry.transition_title}
                        {entry.type === 'workflow' &&
                          ` (${
                            entry.action ? `${entry.prev_state_title} → ` : ''
                          }${entry.state_title})`}
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{entry.actor.fullname}</Table.Cell>
                  <Table.Cell>
                    <span title={moment(entry.time).format('LLLL')}>
                      {moment(entry.time).fromNow()}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{entry.comments}</Table.Cell>
                  <Table.Cell>
                    {entry.type === 'versioning' && (
                      <Dropdown icon="ellipsis horizontal">
                        <Dropdown.Menu className="left">
                          {'version' in entry && entry.version > 0 && (
                            <Link
                              className="item"
                              to={`${getBaseUrl(
                                this.props.pathname,
                              )}/diff?one=${entry.version - 1}&two=${
                                entry.version
                              }`}
                            >
                              <Icon name="copy" />{' '}
                              <FormattedMessage
                                id="View changes"
                                defaultMessage="View changes"
                              />
                            </Link>
                          )}
                          {'version' in entry && (
                            <Link
                              className="item"
                              to={`${getBaseUrl(this.props.pathname)}?version=${
                                entry.version
                              }`}
                            >
                              <Icon name="eye" />{' '}
                              <FormattedMessage
                                id="View this revision"
                                defaultMessage="View this revision"
                              />
                            </Link>
                          )}
                          {'version' in entry && (
                            <Dropdown.Item
                              value={entry.version}
                              onClick={this.onRevert}
                            >
                              <Icon name="undo" />{' '}
                              <FormattedMessage
                                id="Revert to this revision"
                                defaultMessage="Revert to this revision"
                              />
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Segment.Group>
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              activity="history"
              inner={
                <Link
                  to={`${getBaseUrl(this.props.pathname)}`}
                  className="item"
                >
                  <IconNext
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
      </Container>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      entries: state.history.entries,
      pathname: props.location.pathname,
      title: state.content.data.title,
      revertRequest: state.history.revert,
    }),
    { getHistory, revertHistory },
  ),
)(History);
