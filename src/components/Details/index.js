import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

import { ShopHomeHistoryLink } from "../History";
import SignOutButton from "../SignOut";

import mainLogo from "../../assets/logo.png";
import "./detailsStyle.css";

const Details = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <section class="details-section">
        <ShopHomeHistoryLink />
        <div class="owner-logo-position">
          <img src={mainLogo} class="owner-logo-att" />
        </div>
        <div>
          <JobForm authUser={authUser} />
        </div>
        <div class="signout-pos">
          <SignOutButton />
        </div>
      </section>
    )}
  </AuthUserContext.Consumer>
);
class JobFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      diagnosis: "",
      quote: "",
      uid: props.location.state.uid,
      cid: props.location.state.cid,
      urls: props.location.state.urls,
      description: props.location.state.desc,
      shopName: "",
      shopAddress: ""
    };
    this.getShopInfo = this.getShopInfo.bind(this);
    this.submitQuote = this.submitQuote.bind(this);
    this.getShopInfo();
  }
  async getShopInfo() {
    var userRef = this.props.firebase.user(this.state.authUser.uid);
    var data = await userRef.once("value");
    if (!data.val()) {
      return;
    }
    var user = data.val();
    this.setState({
      shopName: user.shopName,
      shopAddress: user.address
    });
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  submitQuote() {
    var caseRef = this.props.firebase
      .user(this.state.uid)
      .child("cases")
      .child(this.state.cid)
      .child("quotes/");
    caseRef.push({
      diagnosis: this.state.diagnosis,
      quote: this.state.quote,
      shopName: this.state.shopName,
      shopAddress: this.state.shopAddress,
      shopid: this.state.authUser.uid,
      accepted: false
    });
    this.props.history.push(ROUTES.SHOP_HOME);
  }
  render() {
    var images = this.state.urls.map(k => {
      return <img src={k.url}></img>;
    });
    var diagnosis = this.state.diagnosis;
    var quote = this.state.quote;
    return (
      <div>
        <h1>Job Details</h1>
        <h2>Description: {this.state.description}</h2>
        <div>{images}</div>
        <div class="input-icons">
          <i class="fa fa-wrench icon" aria-hidden="true"></i>
          <input
            name="diagnosis"
            class="details-textarea"
            value={diagnosis}
            onChange={this.onChange}
            type="text"
            placeholder="Enter your diagnosis"
          />
          <i class="fa fa-usd icon" aria-hidden="true"></i>
          <input
            name="quote"
            class="details-textarea"
            value={quote}
            onChange={this.onChange}
            type="number"
            placeholder="Enter your quote in USD"
          />

          <div>
            <button class="submit-button" onClick={this.submitQuote}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const JobForm = compose(withFirebase, withRouter)(JobFormBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(Details);
