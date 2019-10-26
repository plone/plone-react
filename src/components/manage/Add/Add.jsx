/**
 * Add container.
 * @module components/manage/Add/Add
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { keys } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import qs from 'query-string';
import { settings } from '~/config';

import { createContent, getSchema } from '../../../actions';
import { Form, Icon, Toolbar, Sidebar } from '../../../components';
import {
  getBaseUrl,
  hasTilesData,
  getTilesFieldname,
  getTilesLayoutFieldname,
} from '../../../helpers';

import saveSVG from '../../../icons/save.svg';
import clearSVG from '../../../icons/clear.svg';

const messages = defineMessages({
  add: {
    id: 'Add {type}',
    defaultMessage: 'Add {type}',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
});

/**
 * Add class.
 * @class Add
 * @extends Component
 */
class Add extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    createContent: PropTypes.func.isRequired,
    getSchema: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    schema: PropTypes.objectOf(PropTypes.any),
    content: PropTypes.shape({
      // eslint-disable-line react/no-unused-prop-types
      '@id': PropTypes.string,
      '@type': PropTypes.string,
    }),
    returnUrl: PropTypes.string,
    createRequest: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    schemaRequest: PropTypes.shape({
      loading: PropTypes.bool,
      loaded: PropTypes.bool,
    }).isRequired,
    type: PropTypes.string,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    schema: null,
    content: null,
    returnUrl: null,
    type: 'Default',
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getSchema(this.props.type);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (
      this.props.createRequest.loading &&
      nextProps.createRequest.loaded &&
      nextProps.content['@type'] === this.props.type
    ) {
      this.props.history.push(
        this.props.returnUrl ||
          nextProps.content['@id'].replace(settings.apiPath, ''),
      );
    }
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {object} data Form data.
   * @returns {undefined}
   */
  onSubmit(data) {
    this.props.createContent(getBaseUrl(this.props.pathname), {
      ...data,
      '@static_behaviors': this.props.schema.definitions
        ? keys(this.props.schema.definitions)
        : null,
      '@type': this.props.type,
    });
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.push(getBaseUrl(this.props.pathname));
  }

  form = React.createRef();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const visual = this.props.schema?.properties
      ? hasTilesData(this.props.schema.properties)
      : true;

    return (
      <div id="page-add">
        <Helmet
          title={this.props.intl.formatMessage(messages.add, {
            type: this.props.type,
          })}
        />
        <Form
          ref={this.form}
          schema={this.props.schema}
          formData={
            this.props.schema?.properties
              ? {
                  [getTilesFieldname(this.props.schema.properties)]: null,
                  [getTilesLayoutFieldname(this.props.schema.properties)]: null,
                }
              : {}
          }
          onSubmit={this.onSubmit}
          hideActions
          pathname={this.props.pathname}
          visual={visual}
          title={this.props.intl.formatMessage(messages.add, {
            type: this.props.type,
          })}
          loading={this.props.createRequest.loading}
        />
        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar
            pathname={this.props.pathname}
            hideDefaultViewButtons
            inner={
              <>
                <button
                  id="toolbar-save"
                  className="save"
                  aria-label={this.props.intl.formatMessage(messages.save)}
                  onClick={() => this.form.current.onSubmit()}
                >
                  <Icon
                    name={saveSVG}
                    className="circled"
                    size="30px"
                    title={this.props.intl.formatMessage(messages.save)}
                  />
                </button>
                <button className="cancel" onClick={() => this.onCancel()}>
                  <Icon
                    name={clearSVG}
                    className="circled"
                    aria-label={this.props.intl.formatMessage(messages.cancel)}
                    size="30px"
                    title={this.props.intl.formatMessage(messages.cancel)}
                  />
                </button>
              </>
            }
          />
        </Portal>
        {visual && (
          <Portal node={__CLIENT__ && document.getElementById('sidebar')}>
            <Sidebar />
          </Portal>
        )}
      </div>
    );
  }
}

export default compose(
  DragDropContext(HTML5Backend),
  injectIntl,
  connect(
    (state, props) => ({
      createRequest: state.content.create,
      schemaRequest: state.schema,
      content: state.content.data,
      schema: state.schema.schema,
      pathname: props.location.pathname,
      returnUrl: qs.parse(props.location.search).return_url,
      type: qs.parse(props.location.search).type,
    }),
    { createContent, getSchema },
  ),
)(Add);
