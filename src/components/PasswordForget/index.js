import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './PasswordForgetStyle.css';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import mainLogo from '../../assets/logo.png';

const PasswordForgetPage = () => (
  <section class = "main-section">
  <div>
  <div class = "split-horizontal-border"> </div>
   
   <div class = "main-text" >Forgot Your Password?</div>
   <div class = "split-horizontal-border"> </div>
    
   <center><p> No worries. It happens to all of us. </p></center>
   <center><p> Please enter your email and we'll send you a link to reset your password.</p></center>

   

   <div class="landing-logo-position">
  <img src = {mainLogo} class="landing-logo-att" />

  </div>
   <center><PasswordForgetForm /></center>
  </div>
  </section>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <button disabled={isInvalid} type="submit">
          Reset My Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link class="password-forget-link" to={ROUTES.PASSWORD_FORGET}>
      Forgot Password?
    </Link>
  </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
