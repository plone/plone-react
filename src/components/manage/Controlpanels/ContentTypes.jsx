/**
 * Content Types component.
 * @module components/manage/Controlpanels/ContentTypes
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { getParentUrl } from '@plone/volto/helpers';
import { Portal } from 'react-portal';
import { last } from 'lodash';
import { Confirm, Container, Table, Button, Header } from 'semantic-ui-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import {
  Error,
  Icon,
  ModalForm,
  Toolbar,
  Toast,
  toast,
  ContentTypesActions,
} from '@plone/volto/components';
import {
  getControlpanel,
  postControlpanel,
  deleteControlpanel,
} from '@plone/volto/actions';
import { getId } from '@plone/volto/helpers';

import addSVG from '@plone/volto/icons/add-document.svg';
import backSVG from '@plone/volto/icons/back.svg';

const messages = defineMessages({
  add: {
    id: 'Add',
    defaultMessage: 'Add',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  yes: {
    id: 'Yes',
    defaultMessage: 'Yes',
  },
  no: {
    id: 'No',
    defaultMessage: 'No',
  },
  addTypeFormTitle: {
    id: 'Add new content type',
    defaultMessage: 'Add new content type',
  },
  addTypeButtonTitle: {
    id: 'Add new content type',
    defaultMessage: 'Add new content type',
  },
  addTypeFormTitleTitle: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  addTypeFormDescriptionTitle: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  success: {
    id: 'Success',
    defaultMessage: 'Success',
  },
  typeCreated: {
    id: 'Content type created',
    defaultMessage: 'Content type created',
  },
  deleteConfirmTitle: {
    id: 'Delete Type',
    defaultMessage: 'Delete Type',
  },
  typeDeleted: {
    id: 'Content type deleted',
    defaultMessage: 'Content type deleted',
  },
});

/**
 * ContentTypes class.
 * @class ContentTypes
 * @extends Component
 */
class ContentTypes extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    getControlpanel: PropTypes.func.isRequired,
    postControlpanel: PropTypes.func.isRequired,
    deleteControlpanel: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    cpanelRequest: PropTypes.objectOf(PropTypes.any).isRequired,
    controlpanel: PropTypes.shape({
      '@id': PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          '@id': PropTypes.string,
          title: PropTypes.string,
          description: PropTypes.string,
          count: PropTypes.integer,
        }),
      ),
    }),
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Types
   */
  constructor(props) {
    super(props);
    this.onAddTypeSubmit = this.onAddTypeSubmit.bind(this);
    this.onAddTypeError = this.onAddTypeError.bind(this);
    this.onAddTypeSuccess = this.onAddTypeSuccess.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.onSchema = this.onSchema.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onDeleteCancel = this.onDeleteCancel.bind(this);
    this.onDeleteOk = this.onDeleteOk.bind(this);
    this.onDeleteTypeSuccess = this.onDeleteTypeSuccess.bind(this);

    this.state = {
      showAddType: false,
      addTypeError: '',
      showDelete: false,
      typeToDelete: undefined,
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
    this.props.getControlpanel(this.props.id);
    this.setState({ isClient: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Get
    if (
      this.props.cpanelRequest.get.loading &&
      nextProps.cpanelRequest.get.error
    ) {
      this.setState({
        error: nextProps.cpanelRequest.get.error,
      });
    }

    // Create
    if (
      this.props.cpanelRequest.post.loading &&
      nextProps.cpanelRequest.post.loaded
    ) {
      this.props.getControlpanel(this.props.id);
      this.onAddTypeSuccess();
    }
    if (
      this.props.cpanelRequest.post.loading &&
      nextProps.cpanelRequest.post.error
    ) {
      this.onAddTypeError(nextProps.cpanelRequest.post.error);
    }

    // Delete
    if (
      this.props.cpanelRequest.delete.loading &&
      nextProps.cpanelRequest.delete.loaded
    ) {
      this.props.getControlpanel(this.props.id);
      this.onDeleteTypeSuccess();
    }
  }

  /** Add  */

  /**
   * @param {object} data Form data from the ModalForm.
   * @param {func} callback to set new form data in the ModalForm
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onAddTypeSubmit(data, callback) {
    this.props.postControlpanel(this.props.id, data);
    this.setState({
      addTypeSetFormDataCallback: callback,
    });
  }

  /**
   * Handle Errors after postControlpanel()
   *
   * @param {*} error object. Requires the property .message
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onAddTypeError(error) {
    this.setState({
      addTypeError: error.message,
    });
  }

  /**
   * Handle Success after postControlpanel()
   *
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onAddTypeSuccess() {
    this.state.addTypeSetFormDataCallback({});
    this.setState({
      showAddType: false,
      addTypeError: undefined,
      addTypeSetFormDataCallback: undefined,
    });
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.typeCreated)}
      />,
    );
  }

  /** Edit  */
  /**
   * @param {*} event Event object.
   * @param {*} { value }
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onEdit(event, { value }) {
    this.props.history.push(value);
  }

  /**
   * Layout button click
   * @param {*} event
   * @param {string} value
   * @returns {undefined}
   */
  onLayout(event, { value }) {
    this.props.history.push(value);
  }

  /** Delete */
  /**
   * @param {*} event Event object.
   * @param {*} { value }
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onDelete(event, { value }) {
    if (value) {
      this.setState({
        showDelete: true,
        typeToDelete: value,
      });
    }
  }

  /** Folder
   * @param {Object} event Event object.
   * @param {string} { value }
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onSchema(event, { value }) {
    if (value) {
      this.props.history.push(`${this.props.pathname}/${value}/schema`);
    }
  }

  /**
   * On delete ok
   * @method onDeleteOk
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onDeleteOk() {
    const item = getId(this.state.typeToDelete);
    this.props.deleteControlpanel(this.props.id, item);
    this.setState({
      showDelete: false,
      typeToDelete: undefined,
    });
  }

  /**
   * On delete cancel
   * @method onDeleteCancel
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onDeleteCancel() {
    this.setState({
      showDelete: false,
      typeToDelete: undefined,
    });
  }

  /**
   * Handle Success after deleteControlpanel()
   *
   * @method onDeleteTypeSuccess
   * @memberof ContentTypes
   * @returns {undefined}
   */
  onDeleteTypeSuccess() {
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.typeDeleted)}
      />,
    );
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

    if (!this.props.controlpanel) {
      return <div />;
    }
    return (
      <Container className="types-control-panel">
        <div className="container">
          <Confirm
            open={this.state.showDelete}
            header={this.props.intl.formatMessage(messages.deleteConfirmTitle)}
            cancelButton={this.props.intl.formatMessage(messages.no)}
            confirmButton={this.props.intl.formatMessage(messages.yes)}
            content={
              <div className="content">
                <ul className="content">
                  <FormattedMessage
                    id="Do you really want to delete the type {typename}?"
                    defaultMessage="Do you really want to delete type {typename}?"
                    values={{
                      typename: <b>{getId(this.state.typeToDelete || '')}</b>,
                    }}
                  />
                </ul>
              </div>
            }
            onCancel={this.onDeleteCancel}
            onConfirm={this.onDeleteOk}
          />
          <ModalForm
            open={this.state.showAddType}
            className="modal"
            onSubmit={this.onAddTypeSubmit}
            submitError={this.state.addTypeError}
            onCancel={() => this.setState({ showAddType: false })}
            title={this.props.intl.formatMessage(messages.addTypeFormTitle)}
            loading={this.props.cpanelRequest.post.loading}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: 'Content type',
                  fields: ['title', 'description'],
                },
              ],
              properties: {
                title: {
                  title: this.props.intl.formatMessage(
                    messages.addTypeFormTitleTitle,
                  ),
                  type: 'string',
                  description: '',
                },
                description: {
                  title: this.props.intl.formatMessage(
                    messages.addTypeFormDescriptionTitle,
                  ),
                  type: 'string',
                  description: '',
                },
              },
              required: ['title'],
            }}
          />
        </div>
        <Container>
          <article id="content">
            <Header disabled>{this.props.controlpanel.title}</Header>
            <section id="content-core">
              <Table compact singleLine striped>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <FormattedMessage id="Type" defaultMessage="Type" />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage
                        id="Description"
                        defaultMessage="Description"
                      />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="Items" defaultMessage="Items" />
                    </Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">
                      <FormattedMessage id="Actions" defaultMessage="Actions" />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.props.controlpanel.items.map((item) => (
                    <Table.Row key={item['@id']}>
                      <Table.Cell>
                        <Link to={`${this.props.pathname}/${item['id']}`}>
                          {item.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{item.description}</Table.Cell>
                      <Table.Cell>{item.count}</Table.Cell>
                      <Table.Cell textAlign="right">
                        <ContentTypesActions
                          item={item}
                          path={this.props.pathname}
                          onEdit={this.onEdit}
                          onDelete={this.onDelete}
                          onSchema={this.onSchema}
                          onLayout={this.onLayout}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </section>
          </article>
        </Container>
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <>
                  <Link to={getParentUrl(this.props.pathname)} className="item">
                    <Icon
                      name={backSVG}
                      size="30px"
                      className="contents circled"
                      title={this.props.intl.formatMessage(messages.back)}
                    />
                  </Link>
                  <Button
                    className="add"
                    aria-label={this.props.intl.formatMessage(messages.add)}
                    tabIndex={0}
                    id="toolbar-add"
                    onClick={() => {
                      this.setState({ showAddType: true });
                    }}
                  >
                    <Icon
                      name={addSVG}
                      title={this.props.intl.formatMessage(
                        messages.addTypeButtonTitle,
                      )}
                    />
                  </Button>
                </>
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
      controlpanel: state.controlpanels.controlpanel,
      cpanelRequest: state.controlpanels,
      pathname: props.location.pathname,
      id: last(props.location.pathname.split('/')),
    }),
    {
      getControlpanel,
      postControlpanel,
      deleteControlpanel,
    },
  ),
)(ContentTypes);
