import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import "./SignUpStyle.css";
import mainLogo from "../../assets/logo.png";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import * as ROLES from "../../constants/roles";

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
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  role: "",
  shopName:"",
  shopAddress: "",
  city: "",
  state: "",
  error: null,
  latitude: null,
  longitude: null
};

const ERROR_CODE_ACCOUNT_EXISTS = "auth/email-already-in-use";

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the
  account is already used from one of the social logins, try
  to sign in with one of them. Afterward, associate your accounts
  on your personal account page.
`;

const ERROR_ROLE_UNASSIGNED =
  "Please check if your are a vehicle owner or a body shop owner.";

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.getLocation();
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    console.log(this.state.latitude);
    console.log(this.state.longitude);
  }
  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default: alert("Unknown error accurred");
    }
  }

  displayRoleError(role) {
    if (role === "") {
      return ERROR_ROLE_UNASSIGNED;
    }
  }

  onSubmit = event => {
    const {
      username,
      email,
      passwordOne,
      role,
      latitude,
      longitude,
      shopName
    } = this.state;
    var currentUser;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        currentUser = authUser;
        if(role === ROLES.SHOP){
          console.log("inside shop");
          var address = this.state.shopAddress+", "+this.state.city+", "+this.state.state;
          return this.props.firebase.user(authUser.user.uid).set({
            username,
            email,
            role,
            address,
            shopName
          });
        }else{
          return this.props.firebase.user(authUser.user.uid).set({
            username,
            email,
            role,
            latitude,
            longitude
          });
        }
      })
      .then(() => {
        console.log(role);
        if (role === ROLES.OWNER) {
          return this.props.firebase.doSendEmailVerification(ROUTES.OWNER_HOME); // after email verification page will direct to "/home-owner"
        }
        if (role === ROLES.SHOP) {
          return this.props.firebase.doSendEmailVerification(ROUTES.SHOP_HOME); // after email verification page will direct to "/home-shop"
        }
      })
      .then(() => {
        //this.setState({ ...INITIAL_STATE });
        if (role === ROLES.OWNER) {
          this.props.history.push(ROUTES.OWNER_HOME);
        } else if (role === ROLES.SHOP) {
          this.props.history.push(ROUTES.SHOP_HOME);
        } else {
          // for now no way to reach here
          console.log("redirected to /home");
          this.props.history.push(ROUTES.HOME);
        }
      })
      .then(()=>{
        if(role === ROLES.SHOP){
          var APIAddress = this.state.shopAddress+", "+this.state.city+", "+this.state.state;
          APIAddress = APIAddress.replace(" ","+");
          console.log(APIAddress);
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${APIAddress}&key=AIzaSyA2eIKJXi2Gzs4RVVlH2wKAB6h7i51jvRw`)
          .then(res=>res.json())
          .then(data=>{
            var latitude = data.results[0].geometry.location.lat;
            var longitude = data.results[0].geometry.location.lng;
            console.log(latitude);
            console.log(longitude);

            this.props.firebase.user(currentUser.user.uid).update({
              latitude,
              longitude
            });
          })
        }
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
  onChangeAddress = event => {
    this.setState({ [event.target.name]: event.target.value.toUpperCase() });
  };

  onChangeRadioButton = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      shopAddress,
      city,
      state,
      role,
      shopName,
      error
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "" ||
      role === "";


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
            
            {role === ROLES.SHOP ? <div>
              <h5 class="signup-h5-pass">Shop Name*</h5>
              <input
                class="signup-textarea"
                name="shopName"
                value={shopName}
                onChange={this.onChange}
                type="text"
                placeholder="Joseph's Car Body"
              />
              <h5 class="signup-h5-pass">Shop Address*</h5>
              <input
                class="signup-textarea"
                name="shopAddress"
                value={shopAddress}
                onChange={this.onChangeAddress}
                type="text"
                placeholder="123 S 1ST ST"
              />
              <h5 class="signup-h5-pass">City*</h5>
              <input
                class="signup-textarea"
                name="city"
                value={city}
                onChange={this.onChangeAddress}
                type="text"
                placeholder="SAN JOSE"
              />
              <h5 class="signup-h5-pass">State*</h5>
              <input
                class="signup-textarea"
                name="state"
                value={state}
                onChange={this.onChangeAddress}
                type="text"
                placeholder="CA"
              />
            </div> : null}
            <div class="signup-checkbox1-label">
              <label>
                Body Shop
                <input
                  name="role"
                  type="radio"
                  value={ROLES.SHOP}
                  checked={role === ROLES.SHOP}
                  onChange={this.onChangeRadioButton}
                />
              </label>
            </div>
            <div class="signup-checkbox2-label">
              <label>
                Vehicle Owner
                <input
                  name="role"
                  type="radio"
                  value={ROLES.OWNER}
                  checked={role === ROLES.OWNER}
                  onChange={this.onChangeRadioButton}
                />
              </label>
            </div>
            <div class="signup-button-spacing">
              <button
                class="signup-button"
                disabled={isInvalid}
                type="submit"
                onClick={this.displayRoleError(role)}
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
  withFirebase
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, LandingSignUpButton, SignUpButton };
