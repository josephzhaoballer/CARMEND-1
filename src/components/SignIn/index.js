import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import "./SigninStyle.css";
import mainLogo from "../../assets/logo.png";

import { PasswordForgetLink } from "../PasswordForget";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";


const SignInPage = () => (
  <section class="signin-section">
    <div>
      <div class="signin-logo-position">
        <img src={mainLogo} class="signin-logo-att" />
      </div>
      <div>
        <SignInForm />
        <SignInGoogle />
        <SignInFacebook />
        <SignInTwitter />
        <p class="forgot-pass-link">
          <PasswordForgetLink />
        </p>
      </div>
    </div>
  </section>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const ERROR_CODE_ACCOUNT_EXISTS =
  "auth/account-exists-with-different-credential";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.firebase.onAuthUserListener((user)=>{
          console.log(user.role);
          if(user.role === ROLES.OWNER){
            this.props.history.push(ROUTES.OWNER_HOME);
          }else if(user.role === ROLES.SHOP){
            this.props.history.push(ROUTES.SHOP_HOME);
          }
        })
        // this.setState({ ...INITIAL_STATE });
        // this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };
  

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div class="overall-text">
        <div class="signin-h1-position">
          <h1 class="signin-h1-style">LOGIN</h1>
        </div>
        <div class="signin-form">
          <form onSubmit={this.onSubmit}>
            <h5 class="signin-h5-email">Email Address*</h5>
            <input
              class="signin-textarea"
              name="email"
              value={email}
              onChange={this.onChange}
              type="text"
              placeholder="Email Address"
            />
            <h5 class="signin-h5-pass">Password*</h5>
            <input
              class="signin-textarea"
              name="password"
              value={password}
              onChange={this.onChange}
              type="password"
              placeholder="Password"
            />
            <div class="signin-button-top">
              <button class="signin-button" disabled={isInvalid} type="submit">
                LOGIN
              </button>
              <span class="button-divider"></span>
              <Link to={ROUTES.SIGN_UP}>
                <button class="signin-button">SIGN UP</button>
              </Link>
            </div>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          role: {}
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <div class="signin-form">
        <form onSubmit={this.onSubmit}>
          <button class="signin-button-social-google" type="submit">
            Sign In with Google
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

class SignInFacebookBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          role: {}
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <div class="signin-form">
        <form onSubmit={this.onSubmit}>
          <button class="signin-button-social-facebook" type="submit">
            Sign In with Facebook
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

class SignInTwitterBase extends Component {
  constructor(props) {
    super(props);

    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.additionalUserInfo.profile.name,
          email: socialAuthUser.additionalUserInfo.profile.email,
          role: {}
        });
      })
      .then(() => {
        this.setState({ error: null });
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

  render() {
    const { error } = this.state;

    return (
      <div class="signin-form">
        <form onSubmit={this.onSubmit}>
          <button class="signin-button-social-twitter " type="submit">
            Sign In with Twitter
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const LandingSignInButton = () => (
  <div>
    <Link to={ROUTES.SIGN_IN}>
      <button class="landing-signin-button">SIGNIN</button>
    </Link>
  </div>
);

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase
)(SignInTwitterBase);

export default SignInPage;

export {
  SignInForm,
  SignInGoogle,
  SignInFacebook,
  SignInTwitter,
  LandingSignInButton
};
