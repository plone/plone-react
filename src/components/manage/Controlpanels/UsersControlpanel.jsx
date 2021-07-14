/**
 * Users controlpanel container.
 * @module components/manage/Controlpanels/UsersControlpanel
 */
import {
  createGroup,
  createUser,
  deleteGroup,
  deleteUser,
  listGroups,
  listRoles,
  listUsers,
  updateGroup,
  showAllUsers,
  updateUser,
} from '@plone/volto/actions';
import {
  Icon,
  ModalForm,
  Toast,
  toast,
  Toolbar,
  UsersControlpanelGroups,
  UsersControlpanelUser,
} from '@plone/volto/components';
import { getBaseUrl, Helmet, messages } from '@plone/volto/helpers';
import backSVG from '@plone/volto/icons/back.svg';
import addSvg from '@plone/volto/icons/circle-plus.svg';
import { find, isEqual, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators, compose } from 'redux';
import {
  Button,
  Confirm,
  Container,
  Divider,
  Form,
  Input,
  Segment,
  Table,
} from 'semantic-ui-react';

/**
 * UsersControlpanel class.
 * @class UsersControlpanel
 * @extends Component
 */
class UsersControlpanel extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    listRoles: PropTypes.func.isRequired,
    listUsers: PropTypes.func.isRequired,
    updateUser: PropTypes.func,
    listGroups: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        id: PropTypes.string,
      }),
    ).isRequired,
    users: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string,
        fullname: PropTypes.string,
        roles: PropTypes.arrayOf(PropTypes.string),
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
    this.onSearch = this.onSearch.bind(this);
    this.onSearchGroups = this.onSearchGroups.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteGroup = this.deleteGroup.bind(this);
    this.onDeleteOk = this.onDeleteOk.bind(this);
    this.onDeleteCancel = this.onDeleteCancel.bind(this);
    this.onAddUserSubmit = this.onAddUserSubmit.bind(this);
    this.onAddGroupSubmit = this.onAddGroupSubmit.bind(this);
    this.onAddUserError = this.onAddUserError.bind(this);
    this.onAddGroupError = this.onAddGroupError.bind(this);
    this.onAddUserSuccess = this.onAddUserSuccess.bind(this);
    this.onAddGroupSuccess = this.onAddGroupSuccess.bind(this);
    this.updateUserRole = this.updateUserRole.bind(this);
    this.updateGroupRole = this.updateGroupRole.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onShowAllUser = this.onShowAllUser.bind(this);
    this.state = {
      search: '',
      showAddUser: false,
      showAddUserErrorConfirm: false,
      addUserError: '',
      addGroupError: '',
      showDelete: false,
      userToDelete: undefined,
      updateUser: undefined,
      groupToDelete: undefined,
      showAddGroup: false,
      entries: props.users,
      groupEntries: props.groups,
      isClient: false,
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.listRoles();
    this.props.listGroups();
    this.setState({ isClient: true });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (this.props.deleteRequest.loading && nextProps.deleteRequest.loaded) ||
      (this.props.createRequest.loading && nextProps.createRequest.loaded)
    ) {
      this.props.listUsers(this.state.search);
    }
    if (
      (this.props.deleteGroupRequest.loading &&
        nextProps.deleteGroupRequest.loaded) ||
      (this.props.createGroupRequest.loading &&
        nextProps.createGroupRequest.loaded)
    ) {
      this.props.listGroups(this.state.search);
    }
    if (this.props.createRequest.loading && nextProps.createRequest.loaded) {
      this.onAddUserSuccess();
    }
    if (
      this.props.createGroupRequest.loading &&
      nextProps.createGroupRequest.loaded
    ) {
      this.onAddGroupSuccess();
    }
    if (this.props.createRequest.loading && nextProps.createRequest.error) {
      this.onAddUserError(nextProps.createRequest.error);
    }
    if (this.props.createRequest.loading && nextProps.createRequest.error) {
      this.onAddGroupError(nextProps.createRequest.error);
    }
    this.setState({
      entries: map(nextProps.users, (entry) => {
        const values = find(this.state.entries, { id: entry.id });
        return {
          ...entry,
          roles: values ? values.roles : entry.roles,
        };
      }),
      groupEntries: map(nextProps.groups, (entry) => {
        const values = find(this.state.groupEntries, { id: entry.id });
        return {
          ...entry,
          roles: values ? values.roles : entry.roles,
        };
      }),
    });
  }

  getUserFromProps(value) {
    return find(this.props.users, ['@id', value]);
  }

  getGroupFromProps(value) {
    return find(this.props.groups, ['@id', value]);
  }
  /**
   * Search handler
   * @method onSearch
   * @param {object} event Event object.
   * @returns {undefined}
   */
  onSearch(event) {
    event.preventDefault();
    this.props.listUsers(this.state.search);
  }

  /**
   *
   *
   * @param {*} event Event object
   * @memberof UsersControlpanel
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
   * Delete a user
   * @method delete
   * @param {object} event Event object.
   * @param {string} value username.
   * @returns {undefined}
   */
  delete(event, { value }) {
    if (value) {
      this.setState({
        showDelete: true,
        userToDelete: this.getUserFromProps(value),
      });
    }
  }
  /**
   *
   *
   * @param {*} event Event object.
   * @param {*} { value } id (groupname)
   * @memberof UsersControlpanel
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
    if (this.state.userToDelete) {
      this.props.deleteUser(this.state.userToDelete.id);
      this.setState({
        showDelete: false,
        userToDelete: undefined,
      });
    } else {
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
   * Callback to be called by the ModalForm when the form is submitted.
   *
   * @param {object} data Form data from the ModalForm.
   * @param {func} callback to set new form data in the ModalForm
   * @returns {undefined}
   */
  onAddUserSubmit(data, callback) {
    this.props.createUser(data);
    this.setState({
      addUserSetFormDataCallback: callback,
    });
  }

  /**
   *
   *
   * @param {*} data
   * @param {*} callback
   * @memberof UsersControlpanel
   */
  updateUserRole(name, value) {
    this.setState({
      entries: map(this.state.entries, (entry) => ({
        ...entry,
        roles:
          entry.id === name
            ? entry.roles.includes(value) === false
              ? entry.roles.concat([value])
              : [].concat(entry.roles.filter((e) => e !== value))
            : entry.roles,
      })),
    });
  }
  /**
   *
   * @param {*} name
   * @param {*} value
   * @memberof UsersControlpanel
   */
  updateGroupRole(name, value) {
    this.setState({
      groupEntries: map(this.state.groupEntries, (entry) => ({
        ...entry,
        roles:
          entry.id === name
            ? entry.roles.includes(value) === false
              ? entry.roles.concat([value])
              : [].concat(entry.roles.filter((e) => e !== value))
            : entry.roles,
      })),
    });
  }

  /**
   *
   *
   * @param {object} data Form data from the ModalForm.
   * @param {func} callback to set new form data in the ModalForm
   * @memberof UsersControlpanel
   * @returns {undefined}
   */
  onAddGroupSubmit(data, callback) {
    this.props.createGroup(data);
    this.setState({
      addGroupSetFormDataCallback: callback,
    });
  }

  /**
   * Handle Errors after createUser()
   *
   * @param {object} error object. Requires the property .message
   * @returns {undefined}
   */
  onAddUserError(error) {
    this.setState({
      addUserError: error.message,
    });
  }
  /**
   * Handle Errors after createGroup()
   *
   * @param {*} error object. Requires the property .message
   * @memberof UsersControlpanel
   * @returns {undefined}
   */
  onAddGroupError(error) {
    this.setState({
      addGroupError: error.message,
    });
  }

  /**
   * Handle Success after createUser()
   *
   * @returns {undefined}
   */
  onAddUserSuccess() {
    this.state.addUserSetFormDataCallback({});
    this.setState({
      showAddUser: false,
      addUserError: undefined,
      addUserSetFormDataCallback: undefined,
    });
    toast.success(
      <Toast
        success
        title={this.props.intl.formatMessage(messages.success)}
        content={this.props.intl.formatMessage(messages.userCreated)}
      />,
    );
  }
  /**
   * Handle Success after createGroup()
   *
   * @memberof UsersControlpanel
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
   * Submit handler
   * @method onSubmit
   * @param {object} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    const userData = { roles: {} };
    const groupData = { roles: {} };

    event.preventDefault();
    for (let i = 0; i < this.props.users.length; i += 1) {
      if (!isEqual(this.props.users[i].roles, this.state.entries[i].roles)) {
        this.state.entries[i].roles.forEach((item) => {
          userData.roles[item] = true;
        });
        userData.id = this.state.entries[i].id;
        this.props.updateUser(userData.id, userData);
      }
    }
    for (let i = 0; i < this.props.groups.length; i += 1) {
      if (
        !isEqual(this.props.groups[i].roles, this.state.groupEntries[i].roles)
      ) {
        this.state.groupEntries[i].roles.forEach((item) => {
          groupData.roles[item] = true;
        });
        groupData.id = this.state.groupEntries[i].id;
        this.props.updateGroup(groupData.id, groupData);
      }
    }
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.props.history.push(getBaseUrl(this.props.pathname));
  }

  /**
   * ShowAllUser handler
   * @method onShowAllUser
   * @returns {undefined}
   */
  onShowAllUser() {
    this.props.showAllUsers();
    this.props.listUsers();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    let usernameToDelete = this.state.userToDelete
      ? this.state.userToDelete.username
      : '';
    /*let fullnameToDelete = this.state.userToDelete
      ? this.state.userToDelete.fullname
      : '';*/
    let groupNameToDelete = this.state.groupToDelete
      ? this.state.groupToDelete.id
      : '';

    return (
      <Container className="users-control-panel">
        <Helmet
          title={this.props.intl.formatMessage(messages.usersAndGroups)}
        />
        <div className="container">
          <Confirm
            open={this.state.showDelete}
            header={
              this.state.groupToDelete
                ? this.props.intl.formatMessage(
                    messages.deleteGroupConfirmTitle,
                  )
                : this.props.intl.formatMessage(messages.deleteUserConfirmTitle)
            }
            content={
              this.state.groupToDelete ? (
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
              ) : (
                <div className="content">
                  <ul className="content">
                    <FormattedMessage
                      id="Do you really want to delete the user {username}?"
                      defaultMessage="Do you really want to delete the user {username}?"
                      values={{
                        username: <b>{usernameToDelete}</b>,
                      }}
                    />
                  </ul>
                </div>
              )
            }
            onCancel={this.onDeleteCancel}
            onConfirm={this.onDeleteOk}
            size={null}
          />
          {this.state.showAddUser ? (
            <ModalForm
              open={this.state.showAddUser}
              className="modal"
              onSubmit={this.onAddUserSubmit}
              submitError={this.state.addUserError}
              onCancel={() => this.setState({ showAddUser: false })}
              title={this.props.intl.formatMessage(messages.addUserFormTitle)}
              loading={this.props.createRequest.loading}
              schema={{
                fieldsets: [
                  {
                    id: 'default',
                    title: 'FIXME: User Data',
                    fields: [
                      'username',
                      'fullname',
                      'email',
                      'password',
                      'roles',
                      'groups',
                    ],
                  },
                ],
                properties: {
                  username: {
                    title: this.props.intl.formatMessage(
                      messages.addUserFormUsernameTitle,
                    ),
                    type: 'string',
                    description: '',
                  },
                  fullname: {
                    title: this.props.intl.formatMessage(
                      messages.addUserFormFullnameTitle,
                    ),
                    type: 'string',
                    description: '',
                  },
                  email: {
                    title: this.props.intl.formatMessage(
                      messages.addUserFormEmailTitle,
                    ),
                    type: 'string',
                    description: '',
                    widget: 'email',
                  },
                  password: {
                    title: this.props.intl.formatMessage(
                      messages.addUserFormPasswordTitle,
                    ),
                    type: 'password',
                    description: '',
                    widget: 'password',
                  },
                  roles: {
                    title: this.props.intl.formatMessage(
                      messages.addUserFormRolesTitle,
                    ),
                    type: 'array',
                    choices: this.props.roles.map((role) => [role.id, role.id]),
                    description: '',
                  },
                  groups: {
                    title: this.props.intl.formatMessage(
                      messages.addUserGroupNameTitle,
                    ),
                    type: 'array',
                    choices: this.props.groups.map((group) => [
                      group.id,
                      group.id,
                    ]),
                    description: '',
                  },
                },
                required: ['username', 'fullname', 'email', 'password'],
              }}
            />
          ) : null}

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
                    description: '',
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
                    description: '',
                  },
                },
                required: [
                  'title',
                  'description',
                  'groupname',
                  'email',
                  'roles',
                ],
              }}
            />
          ) : null}
        </div>
        <Segment.Group raised>
          <Segment className="primary">
            <FormattedMessage
              id="Users and groups settings"
              defaultMessage="Users and groups settings"
            />
          </Segment>
          <Segment>
            <FormattedMessage id="Users" defaultMessage="Users" />
          </Segment>
          <Segment>
            <Form onSubmit={this.onSearch}>
              <Form.Field>
                <Input
                  name="SearchableText"
                  action={{ icon: 'search' }}
                  placeholder={this.props.intl.formatMessage(
                    messages.searchUsers,
                  )}
                  onChange={this.onChangeSearch}
                  id="user-search-input"
                />
              </Form.Field>
            </Form>
          </Segment>
          <Form onSubmit={this.onSubmit}>
            <div className="table">
              <Table padded striped attached unstackable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>
                      <FormattedMessage
                        id="User name"
                        defaultMessage="User name"
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
                <Table.Body>
                  <Table.Row>
                    {this.props.showAllUser ? null : (
                      <Table.HeaderCell colspan={9}>
                        <div className="show-all-users">
                          <p>
                            {this.props.intl.formatMessage(
                              messages.showAllUserText,
                            )}
                          </p>
                          <Button
                            className="show-all-users"
                            onClick={this.onShowAllUser}
                          >
                            {this.props.intl.formatMessage(
                              messages.showAllUserButton,
                            )}
                          </Button>
                        </div>
                      </Table.HeaderCell>
                    )}
                  </Table.Row>
                  {this.state.entries.map((user) => (
                    <UsersControlpanelUser
                      key={user.id}
                      onDelete={this.delete}
                      roles={this.props.roles}
                      user={user}
                      updateUser={this.updateUserRole}
                    />
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Form>
          <Segment clearing className="actions">
            {this.props.intl.formatMessage(messages.addUserButtonTitle)}
            <Button
              basic
              primary
              floated="right"
              onClick={() => {
                this.setState({ showAddUser: true });
              }}
            >
              <Icon
                name={addSvg}
                size="30px"
                color="#007eb1"
                className="addSVG"
                title={this.props.intl.formatMessage(messages.add)}
              />
            </Button>
          </Segment>
          <Divider />
          <Segment>
            <FormattedMessage id="Groups" defaultMessage="Groups" />
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
          <Form onSubmit={this.onSubmit}>
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
                <Table.Body>
                  {this.state.groupEntries.map((groups) => (
                    <UsersControlpanelGroups
                      key={groups.id}
                      onDelete={this.deleteGroup}
                      roles={this.props.roles}
                      groups={groups}
                      updateGroups={this.updateGroupRole}
                    />
                  ))}
                </Table.Body>
              </Table>
            </div>
          </Form>
          <Segment clearing className="actions">
            {this.props.intl.formatMessage(messages.addGroupsButtonTitle)}
            <Button
              basic
              primary
              floated="right"
              onClick={() => {
                this.setState({ showAddGroup: true });
              }}
            >
              <Icon
                name={addSvg}
                size="30px"
                color="#007eb1"
                classname="addgroupSVG"
                title={this.props.intl.formatMessage(messages.add)}
              />
            </Button>
          </Segment>
        </Segment.Group>
        {this.state.isClient && (
          <Portal node={document.getElementById('toolbar')}>
            <Toolbar
              pathname={this.props.pathname}
              hideDefaultViewButtons
              inner={
                <>
                  <Link to="/controlpanel" className="item">
                    <Icon
                      name={backSVG}
                      aria-label={this.props.intl.formatMessage(messages.back)}
                      className="contents circled"
                      size="30px"
                      title={this.props.intl.formatMessage(messages.back)}
                    />
                  </Link>
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
      users: state.users.users,
      showAllUser: state.users.showAllUser,
      groups: state.groups.groups,
      description: state.description,
      pathname: props.location.pathname,
      deleteRequest: state.users.delete,
      createRequest: state.users.create,
      deleteGroupRequest: state.groups.delete,
      createGroupRequest: state.groups.create,
    }),
    (dispatch) =>
      bindActionCreators(
        {
          listRoles,
          listUsers,
          deleteUser,
          createUser,
          listGroups,
          deleteGroup,
          createGroup,
          updateUser,
          updateGroup,
          showAllUsers,
        },
        dispatch,
      ),
  ),
)(UsersControlpanel);
