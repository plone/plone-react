/**
 * Users controlpanel container.
 * @module components/manage/Controlpanels/UsersControlpanel
 */
import {
  createGroup,
  deleteGroup,
  listGroups,
  listRoles,
  updateGroup,
  authenticatedRole,
} from '@plone/volto/actions';
import {
  Icon,
  ModalForm,
  Toast,
  Toolbar,
  RenderGroups,
  Pagination,
  Error,
} from '@plone/volto/components';
import { Link } from 'react-router-dom';
import { Helmet, messages } from '@plone/volto/helpers';
import clearSVG from '@plone/volto/icons/clear.svg';
import addUserSvg from '@plone/volto/icons/add-user.svg';
import saveSVG from '@plone/volto/icons/save.svg';
import ploneSVG from '@plone/volto/icons/plone.svg';
import { find, map, pull } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { connect } from 'react-redux';

import { toast } from 'react-toastify';
import { bindActionCreators, compose } from 'redux';
import {
  Confirm,
  Container,
  Button,
  Form,
  Input,
  Segment,
  Table,
} from 'semantic-ui-react';

/**
 * GroupsControlpanel class.
 * @class GroupsControlpanel
 * @extends Component
 */
class GroupsControlpanel extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    listRoles: PropTypes.func.isRequired,
    listGroups: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        id: PropTypes.string,
      }),
    ).isRequired,
    groups: PropTypes.arrayOf(
      PropTypes.shape({
        Title: PropTypes.string,
        Description: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
        groupname: PropTypes.string,
      }),
    ).isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Sharing
   */
  constructor(props) {
    super(props);
    this.onChangeSearch = this.onChangeSearch.bind(this);
    this.onSearchGroups = this.onSearchGroups.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.onDeleteOk = this.onDeleteOk.bind(this);
    this.onDeleteCancel = this.onDeleteCancel.bind(this);
    this.onAddGroupSubmit = this.onAddGroupSubmit.bind(this);
    this.onAddGroupError = this.onAddGroupError.bind(this);
    this.onAddGroupSuccess = this.onAddGroupSuccess.bind(this);
    this.updateGroupRole = this.updateGroupRole.bind(this);
    this.state = {
      search: '',
      addGroupError: '',
      showDelete: false,
      groupToDelete: undefined,
      showAddGroup: false,
      groupEntries: [],
      isClient: false,
      authenticatedRole: props.inheritedRole || [],
      currentPage: 0,
      pageSize: 10,
    };
  }

  fetchData = async () => {
    await this.props.listRoles();
    await this.props.listGroups();
    this.setState({
      groupEntries: this.props.groups,
    });
  };
  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.setState({
      isClient: true,
    });
    this.fetchData();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (this.props.deleteGroupRequest.loading &&
        nextProps.deleteGroupRequest.loaded) ||
      (this.props.createGroupRequest.loading &&
        nextProps.createGroupRequest.loaded)
    ) {
      this.props.listGroups(this.state.search);
    }
    if (
      this.props.createGroupRequest.loading &&
      nextProps.createGroupRequest.loaded
    ) {
      this.onAddGroupSuccess();
    }
    if (
      this.props.createGroupRequest.loading &&
      nextProps.createGroupRequest.error
    ) {
      this.onAddGroupError(nextProps.createGroupRequest.error);
    }
    if (
      this.props.loadRolesRequest.loading &&
      nextProps.loadRolesRequest.error
    ) {
      this.setState({
        error: nextProps.loadRolesRequest.error,
      });
    }
  }

  getGroupFromProps(value) {
    return find(this.props.groups, ['@id', value]);
  }

  /**
   *
   *
   * @param {*} event Event object
   * @memberof GroupsControlpanel
   * @returns {undefined}
   */
  onSearchGroups(event) {
    event.preventDefault();
    this.props.listGroups(this.state.search);
  }

  /**
   * On change search handler
   * @method onChangeSearch
   * @param {object} event Event object.
   * @returns {undefined}
   */
  onChangeSearch(event) {
    this.setState({
      search: event.target.value,
    });
  }

  /**
   *
   *
   * @param {*} event Event object.
   * @param {*} { value } id (groupname)
   * @memberof GroupsControlpanel
   * @returns {undefined}
   */
  deleteGroup(event, { value }) {
    if (value) {
      this.setState({
        showDelete: true,
        groupToDelete: this.getGroupFromProps(value),
      });
    }
  }

  /**
   * On delete ok
   * @method onDeleteOk
   * @returns {undefined}
   */
  onDeleteOk() {
    if (this.state.groupToDelete) {
      this.props.deleteGroup(this.state.groupToDelete.id);
      this.setState({
        showDelete: false,
        groupToDelete: undefined,
      });
    }
  }

  /**
   * On delete cancel
   * @method onDeleteCancel
   * @returns {undefined}
   */
  onDeleteCancel() {
    this.setState({
      showDelete: false,
      itemsToDelete: [],
    });
  }

  /**
   *
   * @param {*} name
   * @param {*} value
   * @memberof GroupsControlpanel
   */
  updateGroupRole(name, value) {
    this.setState((prevState) => ({
      groupEntries: map(this.state.groupEntries, (entry) => ({
        ...entry,
        roles:
          entry.id === name && !entry.roles.includes(value)
            ? [...entry.roles, value]
            : entry.id !== name
            ? entry.roles
            : pull(entry.roles, value),
      })),
      authenticatedRole:
        name === 'AuthenticatedUsers' &&
        !prevState.authenticatedRole.includes(value)
          ? [...prevState.authenticatedRole, value]
          : name !== 'AuthenticatedUsers'
          ? prevState.authenticatedRole
          : pull(prevState.authenticatedRole, value),
    }));
  }
  /**
   * @param {*} event
   * @memberof GroupsControlpanel
   */
  updateGroupRoleSubmit = (e) => {
    e.stopPropagation();
    this.state.groupEntries.forEach((item) => {
      this.props.updateGroup(item.id, item);
    });
    this.props.authenticatedRole(this.state.authenticatedRole);
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.updateGroups)}
      />,
    );
  };
  /**
   *
   *
   * @param {object} data Form data from the ModalForm.
   * @param {func} callback to set new form data in the ModalForm
   * @memberof GroupsControlpanel
   * @returns {undefined}
   */
  onAddGroupSubmit(data, callback) {
    this.props.createGroup(data);
    this.setState({
      addGroupSetFormDataCallback: callback,
    });
  }

  /**
   * Handle Errors after createGroup()
   *
   * @param {*} error object. Requires the property .message
   * @memberof GroupsControlpanel
   * @returns {undefined}
   */
  onAddGroupError(error) {
    this.setState({
      addGroupError: error.response.body.message,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.groups !== prevProps.groups) {
      this.setState({
        groupEntries: this.props.groups,
      });
    }
  }

  /**
   * Handle Success after createGroup()
   *
   * @memberof GroupsControlpanel
   * @returns {undefined}
   */
  onAddGroupSuccess() {
    this.state.addGroupSetFormDataCallback({});
    this.setState({
      showAddGroup: false,
      addGroupError: undefined,
      addGroupSetFormDataCallback: undefined,
    });
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.groupCreated)}
      />,
    );
  }

  /**
   * On change page
   * @method onChangePage
   * @param {object} event Event object.
   * @param {string} value Page value.
   * @returns {undefined}
   */
  onChangePage = (event, { value }) => {
    this.setState({
      currentPage: value,
    });
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }
    /*let fullnameToDelete = this.state.groupToDelete
        ? this.state.groupToDelete.fullname
        : '';*/
    let groupNameToDelete = this.state.groupToDelete
      ? this.state.groupToDelete.id
      : '';

    return (
      <Container className="users-control-panel">
        <Helmet title={this.props.intl.formatMessage(messages.groups)} />
        <div className="container">
          <Confirm
            open={this.state.showDelete}
            header={this.props.intl.formatMessage(
              messages.deleteGroupConfirmTitle,
            )}
            content={
              <div className="content">
                <ul className="content">
                  <FormattedMessage
                    id="Do you really want to delete the group {groupname}?"
                    defaultMessage="Do you really want to delete the group {groupname}?"
                    values={{
                      groupname: <b>{groupNameToDelete}</b>,
                    }}
                  />
                </ul>
              </div>
            }
            onCancel={this.onDeleteCancel}
            onConfirm={this.onDeleteOk}
            size={null}
          />
          {this.state.showAddGroup ? (
            <ModalForm
              open={this.state.showAddGroup}
              className="modal"
              onSubmit={this.onAddGroupSubmit}
              submitError={this.state.addGroupError}
              onCancel={() => this.setState({ showAddGroup: false })}
              title={this.props.intl.formatMessage(messages.addGroupsFormTitle)}
              loading={this.props.createGroupRequest.loading}
              schema={{
                fieldsets: [
                  {
                    id: 'default',
                    title: 'FIXME: Group Data',
                    fields: [
                      'title',
                      'description',
                      'groupname',
                      'email',
                      'roles',
                    ],
                  },
                ],
                properties: {
                  title: {
                    title: this.props.intl.formatMessage(
                      messages.addGroupsFormTitleTitle,
                    ),
                    type: 'string',
                    description: '',
                  },
                  description: {
                    title: this.props.intl.formatMessage(
                      messages.addGroupsFormDescriptionTitle,
                    ),
                    type: 'string',
                    description: '',
                  },
                  groupname: {
                    title: this.props.intl.formatMessage(
                      messages.addGroupsFormGroupNameTitle,
                    ),
                    type: 'string',
                    description:
                      'A unique identifier for the group. Can not be changed after creation.',
                  },
                  email: {
                    title: this.props.intl.formatMessage(
                      messages.addGroupsFormEmailTitle,
                    ),
                    type: 'string',
                    description: '',
                    widget: 'email',
                  },
                  roles: {
                    title: this.props.intl.formatMessage(
                      messages.addGroupsFormRolesTitle,
                    ),
                    type: 'array',
                    choices: this.props.roles.map((role) => [role.id, role.id]),
                    noValueOption: false,
                    description: '',
                  },
                },
                required: ['groupname'],
              }}
            />
          ) : null}
        </div>
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage id="Groups" defaultMessage="Groups" />
          </Segment>
          <Segment secondary>
            <FormattedMessage
              id="Groups are logical collections of users, such as departments and business units. Groups are not directly related to permissions on a global level, you normally use Roles for that - and let certain Groups have a particular role. The symbol{plone_svg}indicates a role inherited from membership in another group."
              defaultMessage="Groups are logical collections of users, such as departments and business units. Groups are not directly related to permissions on a global level, you normally use Roles for that - and let certain Groups have a particular role. The symbol{plone_svg}indicates a role inherited from membership in another group."
              values={{
                plone_svg: (
                  <Icon
                    name={ploneSVG}
                    size="20px"
                    color="#007EB1"
                    title={'plone-svg'}
                  />
                ),
              }}
            />
          </Segment>
          <Segment>
            <Form onSubmit={this.onSearchGroups}>
              <Form.Field>
                <Input
                  name="SearchableText"
                  action={{ icon: 'search' }}
                  placeholder={this.props.intl.formatMessage(
                    messages.searchGroups,
                  )}
                  onChange={this.onChangeSearch}
                  id="group-search-input"
                />
              </Form.Field>
            </Form>
          </Segment>
          <Form>
            <div className="table">
              <Table padded striped attached unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <FormattedMessage
                        id="Groupname"
                        defaultMessage="Groupname"
                      />
                    </Table.HeaderCell>
                    {this.props.roles.map((role) => (
                      <Table.HeaderCell key={role.id}>
                        {role.id}
                      </Table.HeaderCell>
                    ))}
                    <Table.HeaderCell>
                      <FormattedMessage id="Actions" defaultMessage="Actions" />
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body data-group="groups">
                  {this.state.groupEntries
                    .slice(
                      this.state.currentPage * 10,
                      this.state.pageSize * (this.state.currentPage + 1),
                    )
                    .map((group) => (
                      <RenderGroups
                        key={group.id}
                        onDelete={this.deleteGroup}
                        roles={this.props.roles}
                        group={group}
                        updateGroups={this.updateGroupRole}
                        inheritedRole={this.state.authenticatedRole}
                      />
                    ))}
                </Table.Body>
              </Table>
            </div>
            <div className="contents-pagination">
              <Pagination
                current={this.state.currentPage}
                total={Math.ceil(
                  this.state.groupEntries?.length / this.state.pageSize,
                )}
                onChangePage={this.onChangePage}
              />
            </div>
          </Form>
        </Segment.Group>
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
                    onClick={this.updateGroupRoleSubmit}
                    loading={this.props.createGroupRequest.loading}
                  >
                    <Icon
                      name={saveSVG}
                      className="circled"
                      size="30px"
                      title={this.props.intl.formatMessage(messages.save)}
                    />
                  </Button>
                  <Link to="/controlpanel" className="cancel">
                    <Icon
                      name={clearSVG}
                      className="circled"
                      aria-label={this.props.intl.formatMessage(
                        messages.cancel,
                      )}
                      size="30px"
                      title={this.props.intl.formatMessage(messages.cancel)}
                    />
                  </Link>
                  <Button
                    id="toolbar-add"
                    aria-label={this.props.intl.formatMessage(
                      messages.addGroupsButtonTitle,
                    )}
                    onClick={() => {
                      this.setState({ showAddGroup: true });
                    }}
                    loading={this.props.createGroupRequest.loading}
                  >
                    <Icon
                      name={addUserSvg}
                      size="45px"
                      color="#826A6A"
                      title={this.props.intl.formatMessage(
                        messages.addGroupsButtonTitle,
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
      roles: state.roles.roles,
      groups: state.groups.groups,
      description: state.description,
      pathname: props.location.pathname,
      deleteGroupRequest: state.groups.delete,
      createGroupRequest: state.groups.create,
      loadRolesRequest: state.roles,
      inheritedRole: state.authRole.authenticatedRole,
    }),
    (dispatch) =>
      bindActionCreators(
        {
          listRoles,
          listGroups,
          deleteGroup,
          createGroup,
          updateGroup,
          authenticatedRole,
        },
        dispatch,
      ),
  ),
)(GroupsControlpanel);
