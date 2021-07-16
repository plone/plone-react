/**
 * Diff component.
 * @module components/manage/Diff/Diff
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { filter, isEqual, map } from 'lodash';
import { Container, Button, Dropdown, Grid, Table } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { Portal } from 'react-portal';
import moment from 'moment';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import qs from 'query-string';

import { getDiff, getSchema, getHistory } from '@plone/volto/actions';
import {
  getBaseUrl,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from '@plone/volto/helpers';
import { DiffField, Icon, Toolbar } from '@plone/volto/components';

import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  diff: {
    id: 'Diff',
    defaultMessage: 'Diff',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  split: {
    id: 'Split',
    defaultMessage: 'Split',
  },
  unified: {
    id: 'Unified',
    defaultMessage: 'Unified',
  },
});

/**
 * Diff class.
 * @class Diff
 * @extends Component
 */
class Diff extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getDiff: PropTypes.func.isRequired,
    getSchema: PropTypes.func.isRequired,
    getHistory: PropTypes.func.isRequired,
    schema: PropTypes.objectOf(PropTypes.any),
    pathname: PropTypes.string.isRequired,
    one: PropTypes.string.isRequired,
    two: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
      }),
    ).isRequired,
    historyEntries: PropTypes.arrayOf(
      PropTypes.shape({
        version: PropTypes.number,
        time: PropTypes.string,
        actor: PropTypes.shape({ fullname: PropTypes.string }),
      }),
    ).isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    schema: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs DiffComponent
   */
  constructor(props) {
    super(props);
    this.onChangeOne = this.onChangeOne.bind(this);
    this.onChangeTwo = this.onChangeTwo.bind(this);
    this.onSelectView = this.onSelectView.bind(this);
    this.state = { isClient: false };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getSchema(this.props.type);
    this.props.getHistory(getBaseUrl(this.props.pathname));
    this.props.getDiff(
      getBaseUrl(this.props.pathname),
      this.props.one,
      this.props.two,
    );
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      this.props.pathname !== nextProps.pathname ||
      this.props.one !== nextProps.one ||
      this.props.two !== nextProps.two
    ) {
      this.props.getDiff(
        getBaseUrl(nextProps.pathname),
        nextProps.one,
        nextProps.two,
      );
    }
  }

  /**
   * On select view handler
   * @method onSelectView
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onSelectView(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${this.props.one}&two=${this.props.two}&view=${value}`,
    );
  }

  /**
   * On change one handler
   * @method onChangeOne
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onChangeOne(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${value}&two=${this.props.two}&view=${this.props.view}`,
    );
  }

  /**
   * On change two handler
   * @method onChangeTwo
   * @param {object} event Event object
   * @param {string} value Value
   * @returns {undefined}
   */
  onChangeTwo(event, { value }) {
    this.props.history.push(
      `${this.props.pathname}?one=${this.props.one}&two=${value}&view=${this.props.view}`,
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const versions = map(
      filter(this.props.historyEntries, (entry) => 'version' in entry),
      (entry, index) => ({
        text: `${index === 0 ? 'Current' : entry.version} (${moment(
          entry.time,
        ).format('LLLL')}, ${entry.actor.fullname})`,
        value: `${entry.version}`,
        key: `${entry.version}`,
      }),
    );

    return (
      <Container id="page-diff">
        <Helmet title={this.props.intl.formatMessage(messages.diff)} />
        <h1>
          <FormattedMessage
            id="Difference between revision {one} and {two} of {title}"
            defaultMessage="Difference between revision {one} and {two} of {title}"
            values={{
              one: this.props.one,
              two: this.props.two,
              title: this.props.title,
            }}
          />
        </h1>
        <Grid>
          <Grid.Column width={9}>
            <p className="description">
              <FormattedMessage
                id="You can view the difference of the revisions below."
                defaultMessage="You can view the difference of the revisions below."
              />
            </p>
          </Grid.Column>
          <Grid.Column width={3} textAlign="right">
            <Button.Group>
              {map(
                [
                  {
                    id: 'split',
                    label: this.props.intl.formatMessage(messages.split),
                  },
                  {
                    id: 'unified',
                    label: this.props.intl.formatMessage(messages.unified),
                  },
                ],
                (view) => (
                  <Button
                    key={view.id}
                    value={view.id}
                    active={this.props.view === view.id}
                    onClick={this.onSelectView}
                  >
                    {view.label}
                  </Button>
                ),
              )}
            </Button.Group>
          </Grid.Column>
        </Grid>
        {this.props.historyEntries.length > 0 && (
          <Table basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={6}>
                  <FormattedMessage id="Base" defaultMessage="Base" />
                  <Dropdown
                    onChange={this.onChangeOne}
                    value={this.props.one}
                    selection
                    fluid
                    options={versions}
                  />
                </Table.HeaderCell>
                <Table.HeaderCell width={6}>
                  <FormattedMessage id="Compare" defaultMessage="Compare" />
                  <Dropdown
                    onChange={this.onChangeTwo}
                    value={this.props.two}
                    selection
                    fluid
                    options={versions}
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
          </Table>
        )}
        {this.props.schema &&
          this.props.data.length > 0 &&
          map(this.props.schema.fieldsets, (fieldset) =>
            map(
              fieldset.fields,
              (field) =>
                !isEqual(
                  this.props.data[0][field],
                  this.props.data[1][field],
                ) &&
                field !== getBlocksFieldname(this.props.data[0]) &&
                field !== getBlocksLayoutFieldname(this.props.data[0]) && (
                  <DiffField
                    key={field}
                    one={this.props.data[0][field]}
                    two={this.props.data[1][field]}
                    schema={this.props.schema.properties[field]}
                    view={this.props.view}
                  />
                ),
            ),
          )}
        {this.props.schema &&
          this.props.data.length > 0 &&
          hasBlocksData(this.props.data[0]) &&
          (!isEqual(
            this.props.data[0][getBlocksFieldname(this.props.data[0])],
            this.props.data[1][getBlocksFieldname(this.props.data[1])],
          ) ||
            !isEqual(
              this.props.data[0][getBlocksLayoutFieldname(this.props.data[0])],
              this.props.data[1][getBlocksLayoutFieldname(this.props.data[1])],
            )) && (
            <DiffField
              one={this.props.data[0][getBlocksFieldname(this.props.data[0])]}
              two={this.props.data[1][getBlocksFieldname(this.props.data[1])]}
              contentOne={this.props.data[0]}
              contentTwo={this.props.data[1]}
              schema={
                this.props.schema.properties[
                  getBlocksFieldname(this.props.data[0])
                ]
              }
              view={this.props.view}
            />
          )}
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              activity="diff"
              inner={
                <Link
                  to={`${getBaseUrl(this.props.pathname)}/history`}
                  className="item"
                >
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
      </Container>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      data: state.diff.data,
      historyEntries: state.history.entries,
      schema: state.schema.schema,
      pathname: props.location.pathname,
      one: qs.parse(props.location.search).one,
      two: qs.parse(props.location.search).two,
      view: qs.parse(props.location.search).view || 'split',
      title: state.content.data.title,
      type: state.content.data['@type'],
    }),
    { getDiff, getSchema, getHistory },
  ),
)(Diff);
