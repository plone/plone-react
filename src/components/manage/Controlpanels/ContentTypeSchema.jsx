/**
 * Content type schema.
 * @module components/manage/Controlpanels/ContentTypeSchema
 */

import { getSchema, putSchema } from '@plone/volto/actions';
import { getParentUrl } from '@plone/volto/helpers';
import { nth } from 'lodash';
import {
  Error,
  Form,
  Icon,
  Toast,
  toast,
  Toolbar,
} from '@plone/volto/components';
import clearSVG from '@plone/volto/icons/clear.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Header } from 'semantic-ui-react';

const messages = defineMessages({
  title: {
    id: '{id} Schema',
    defaultMessage: '{id} Schema',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  typeCreated: {
    id: 'Schema updates',
    defaultMessage: 'Schema updates',
  },
  info: {
    id: 'Info',
    defaultMessage: 'Info',
  },
  changesSaved: {
    id: 'Changes saved.',
    defaultMessage: 'Changes saved.',
  },
});

/**
 * ContentTypeSchema class.
 * @class ContentTypeSchema
 * @extends Component
 */
class ContentTypeSchema extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getSchema: PropTypes.func.isRequired,
    putSchema: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {};

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      schema: null,
      content: null,
      isClient: false,
    };

    this.onCancel = this.onCancel.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.form = React.createRef();
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getSchema(this.props.id);
    this.setState({ isClient: true });
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Schema error
    if (this.props.schemaRequest.loading && nextProps.schemaRequest.error) {
      this.setState({
        error: nextProps.schemaRequest.error,
      });
    }

    // Schema GET
    if (this.props.schemaRequest.loading && nextProps.schemaRequest.loaded) {
      let properties = nextProps.schema?.properties || {};
      let content = {};
      let value, key;
      for (key in properties) {
        value = properties[key].default;
        if (value) {
          content[key] = value;
        }
      }

      this.setState({
        schema: nextProps.schema,
        content: content,
      });
    }

    // Schema updated
    if (
      this.props.schemaRequest.put.loading &&
      nextProps.schemaRequest.put.loaded
    ) {
      // this.props.getSchema(this.props.id);
      toast.info(
        <Toast
          info
          title={this.props.intl.formatMessage(messages.info)}
          content={this.props.intl.formatMessage(messages.changesSaved)}
        />,
      );
    }

    // Schema update error
    if (
      this.props.schemaRequest.put.loading &&
      nextProps.schemaRequest.put.error
    ) {
      toast.error(
        <Toast
          error
          title={this.props.intl.formatMessage(messages.error)}
          content={JSON.stringify(
            nextProps.schemaRequest.put.error.response.body ||
              nextProps.schemaRequest.put.error.response.text,
          )}
        />,
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
    this.props.putSchema(this.props.id, data.schema);
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    let url = getParentUrl(this.props.pathname);
    this.props.history.push(getParentUrl(url));
  }

  form = React.createRef();

  makeSchemaList = (schema) => {
    const result = {
      title: 'Schema',
      type: 'object',
      fieldsets: [
        {
          fields: ['schema'],
          id: 'default',
          title: 'Default',
        },
      ],
      properties: {
        schema: {
          description: 'Form schema',
          title: 'Form schema',
          type: 'schema',
          id: 'schema',
        },
      },
      required: [],
      layouts: null,
    };
    result.layouts = schema.layouts.slice();

    return result;
  };

  isEditable = (field) =>
    !field.behavior || field.behavior.includes('generated');

  makeSchemaData = (schema, contentType) => {
    const fieldsets = schema.fieldsets.map((fieldset) => {
      const readOnlyFields = fieldset.fields.filter(
        (fieldId) =>
          !this.isEditable(schema.properties[fieldId]) &&
          fieldId !== 'changeNote',
      );
      const userCreatedFields = fieldset.fields.filter((fieldId) =>
        this.isEditable(schema.properties[fieldId]),
      );
      const changeNote = fieldset.fields.filter(
        (fieldId) => fieldId === 'changeNote',
      );
      return {
        ...fieldset,
        fields: [...readOnlyFields, ...userCreatedFields, ...changeNote],
      };
    });
    const result = {
      ...schema,
      fieldsets,
      contentType,
    };

    return { schema: JSON.stringify(result) };
  };

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

    if (this.state.schema) {
      const contentTypeSchema = this.makeSchemaList(this.state.schema);
      const schemaData = this.makeSchemaData(this.state.schema, this.props.id);

      return (
        <div id="page-controlpanel-schema" className="ui container">
          <Header disabled>
            {this.props.intl.formatMessage(messages.title, {
              id: this.props?.schema?.title || this.props.id,
            })}
          </Header>
          <Form
            ref={this.form}
            schema={contentTypeSchema}
            formData={schemaData}
            pathname={this.props.pathname}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
            hideActions
          />
          {this.state.isClient && (
            <Portal node={document.getElementById('toolbar')}>
              <Toolbar
                pathname={this.props.pathname}
                hideDefaultViewButtons
                inner={
                  <>
                    <Button
                      id="toolbar-save"
                      className="save"
                      aria-label={this.props.intl.formatMessage(messages.save)}
                      onClick={() => this.form.current.onSubmit()}
                      disabled={this.props.schemaRequest.put.loading}
                      loading={this.props.schemaRequest.put.loading}
                    >
                      <Icon
                        name={saveSVG}
                        className="circled"
                        size="30px"
                        title={this.props.intl.formatMessage(messages.save)}
                      />
                    </Button>
                    <Button
                      className="cancel"
                      aria-label={this.props.intl.formatMessage(
                        messages.cancel,
                      )}
                      onClick={() => this.onCancel()}
                    >
                      <Icon
                        name={clearSVG}
                        className="circled"
                        size="30px"
                        title={this.props.intl.formatMessage(messages.cancel)}
                      />
                    </Button>
                  </>
                }
              />
            </Portal>
          )}
        </div>
      );
    }

    return <div />;
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      schema: state.schema.schema,
      schemaRequest: state.schema,
      pathname: props.location.pathname,
      id: nth(props.location.pathname.split('/'), -2),
    }),
    {
      getSchema,
      putSchema,
    },
  ),
)(ContentTypeSchema);
