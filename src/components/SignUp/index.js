import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import './SignupStyle.css';
import mainLogo from '../../assets/logo.png';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <section class="signup-section">
    <div>
      <div class="signup-logo-position">
        <img src={mainLogo} class="signup-logo-att" />
      </div>
      <SignUpForm />
    </div>
  </section>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  isAdmin: false,
  error: null,
};

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, isAdmin } = this.state;
    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          roles,
        });
      })
      .then(() => {
        return this.props.firebase.doSendEmailVerification();
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      isAdmin,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <div class="overall-text">
        <div class="signup-h1-position">
          <h1 class="signup-h1-style">SIGNUP</h1>
        </div>
        <div class="signup-form">
          <form onSubmit={this.onSubmit}>
            <h5 class="signup-h5-username">Username*</h5>
            <input
              class="signup-textarea"
              name="username"
              value={username}
              onChange={this.onChange}
              type="text"
              placeholder="ie. Jeffrey Nguyen"
            />
            <h5 class="signup-h5-email">Email Address*</h5>
            <input
              class="signup-textarea"
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <h5 class="signup-h5-pass">Password*</h5>
            <input
              class="signup-textarea"
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <h5 class="signup-h5-confirm">Re-enter Password*</h5>
            <input
              class="signup-textarea"
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm Password"
            />

            {/** <label class="signup-admin-label">
              Admin:
              <input
                name="isAdmin"
                type="checkbox"
                checked={isAdmin}
                onChange={this.onChangeCheckbox}
              />
            </label>
            <br />*/}
            <div class="signup-button-spacing">
              <button
                class="signup-button"
                disabled={isInvalid}
                type="submit"
              >
                Sign Up
              </button>
              <p>
                <Link class="login-link-text" to={ROUTES.SIGN_IN}>
                  Already have a login?
                </Link>
              </p>
            </div>

            {error && <p class="error-size">{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const LandingSignUpButton = () => (
  <Link to={ROUTES.SIGN_UP}>
    <button class="signup-landing-button">SIGNUP</button>
  </Link>
);

const SignUpButton = () => (
  <div>
    <Link to={ROUTES.SIGN_UP}>
      <button class="signup-general-button">SIGNUP</button>
    </Link>
  </div>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, LandingSignUpButton, SignUpButton };
