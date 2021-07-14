/**
 * Login container.
 * @module components/theme/Login/Login
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Button,
  Form,
  Input,
  Segment,
  Grid,
} from 'semantic-ui-react';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import qs from 'query-string';
import { withRouter } from 'react-router-dom';

import { getNavigation, login } from '@plone/volto/actions';
import { Icon, Toast, toast } from '@plone/volto/components';

import aheadSVG from '@plone/volto/icons/ahead.svg';
import clearSVG from '@plone/volto/icons/clear.svg';

import config from '@plone/volto/registry';

const messages = defineMessages({
  login: {
    id: 'Log in',
    defaultMessage: 'Log in',
  },
  loginName: {
    id: 'Login Name',
    defaultMessage: 'Login Name',
  },
  Login: {
    id: 'Login',
    defaultMessage: 'Login',
  },
  password: {
    id: 'Password',
    defaultMessage: 'Password',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  loginFailed: {
    id: 'Login Failed',
    defaultMessage: 'Login Failed',
  },
  loginFailedContent: {
    id:
      'Both email address and password are case sensitive, check that caps lock is not enabled.',
    defaultMessage:
      'Both email address and password are case sensitive, check that caps lock is not enabled.',
  },
  register: {
    id: 'Register',
    defaultMessage: 'Register',
  },
  forgotPassword: {
    id: 'box_forgot_password_option',
    defaultMessage: 'Forgot your password?',
  },
});

/**
 * Login class.
 * @class Login
 * @extends Component
 */
class Login extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    login: PropTypes.func.isRequired,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    loading: PropTypes.bool,
    token: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
    returnUrl: PropTypes.string,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    error: null,
    loading: null,
    token: null,
    returnUrl: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      this.props.history.push(this.props.returnUrl || '/');
      if (toast.isActive('loginFailed')) {
        toast.dismiss('loginFailed');
      }
    }
    if (nextProps.error) {
      if (!toast.isActive('loginFailed')) {
        toast.error(
          <Toast
            error
            title={this.props.intl.formatMessage(messages.loginFailed)}
            content={this.props.intl.formatMessage(messages.loginFailedContent)}
          />,
          { autoClose: false, toastId: 'loginFailed' },
        );
      }
    }
  }

  componentWillUnmount() {
    if (toast.isActive('loginFailed')) {
      toast.dismiss('loginFailed');
    }
  }

  /**
   * On login handler
   * @method onLogin
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  onLogin(event) {
    this.props.login(
      document.getElementsByName('login')[0].value,
      document.getElementsByName('password')[0].value,
    );
    event.preventDefault();
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <div id="page-login">
        <Helmet title={this.props.intl.formatMessage(messages.Login)} />
        <Container text>
          <Form method="post" onSubmit={this.onLogin}>
            <Segment.Group raised>
              <Segment className="primary">
                <FormattedMessage id="Log In" defaultMessage="Login" />
              </Segment>
              <Segment secondary>
                <FormattedMessage
                  id="Sign in to start session"
                  defaultMessage="Sign in to start session"
                />
              </Segment>
              <Segment className="form">
                <Form.Field inline className="help">
                  <Grid>
                    <Grid.Row stretched>
                      <Grid.Column width="4">
                        <div className="wrapper">
                          <label htmlFor="login">
                            <FormattedMessage
                              id="Login Name"
                              defaultMessage="Login Name"
                            />
                          </label>
                        </div>
                      </Grid.Column>
                      <Grid.Column width="8">
                        {/* eslint-disable jsx-a11y/no-autofocus */}
                        <Input
                          id="login"
                          name="login"
                          placeholder={this.props.intl.formatMessage(
                            messages.loginName,
                          )}
                          autoFocus
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
                <Form.Field inline className="help">
                  <Grid>
                    <Grid.Row stretched>
                      <Grid.Column stretched width="4">
                        <div className="wrapper">
                          <label htmlFor="password">
                            <FormattedMessage
                              id="Password"
                              defaultMessage="Password"
                            />
                          </label>
                        </div>
                      </Grid.Column>
                      <Grid.Column stretched width="8">
                        <Input
                          type="password"
                          id="password"
                          name="password"
                          placeholder={this.props.intl.formatMessage(
                            messages.password,
                          )}
                          tabIndex={0}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
                <Form.Field inline className="help">
                  <Grid>
                    <Grid.Row stretched>
                      {config.settings.showSelfRegistration && (
                        <Grid.Column stretched width="12">
                          <p className="help">
                            <Link to="/register">
                              {this.props.intl.formatMessage(messages.register)}
                            </Link>
                          </p>
                        </Grid.Column>
                      )}
                      <Grid.Column stretched width="12">
                        <p className="help">
                          <Link to="/password-reset">
                            {this.props.intl.formatMessage(
                              messages.forgotPassword,
                            )}
                          </Link>
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Form.Field>
              </Segment>
              <Segment className="actions" clearing>
                <Button
                  basic
                  primary
                  floated="right"
                  type="submit"
                  id="login-form-submit"
                  aria-label={this.props.intl.formatMessage(messages.login)}
                  title={this.props.intl.formatMessage(messages.login)}
                  loading={this.props.loading}
                >
                  <Icon className="circled" name={aheadSVG} size="30px" />
                </Button>

                <Button
                  basic
                  secondary
                  id="login-form-cancel"
                  as={Link}
                  to="/"
                  aria-label={this.props.intl.formatMessage(messages.cancel)}
                  title={this.props.intl.formatMessage(messages.cancel)}
                  floated="right"
                >
                  <Icon className="circled" name={clearSVG} size="30px" />
                </Button>
              </Segment>
            </Segment.Group>
          </Form>
        </Container>
      </div>
    );
  }
}

export default compose(
  withRouter,
  injectIntl,
  connect(
    (state, props) => ({
      error: state.userSession.login.error,
      loading: state.userSession.login.loading,
      token: state.userSession.token,
      returnUrl:
        qs.parse(props.location.search).return_url ||
        props.location.pathname
          .replace(/\/login$/, '')
          .replace(/\/logout$/, '') ||
        '/',
    }),
    { login, getNavigation },
  ),
)(Login);
