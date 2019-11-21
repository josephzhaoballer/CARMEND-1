import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import "./HistoryStyle.css";
import mainLogo from "../../assets/logo.png";

import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

const History = () => (
  <section class = "owner-history-section">
  <div class="overall-text">
  <div class="landing-logo-position">
        <img src={mainLogo} class="landing-logo-att" />
      </div>
  <AuthUserContext.Consumer>
    {authUser => <CaseHistory authUser={authUser} />}
  </AuthUserContext.Consumer>
  </div>
  </section>

);
class CaseHistoryBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      cases: []
    };
    this.fetchCases = this.fetchCases.bind(this);
    this.gotCases = this.gotCases.bind(this);
    this.gotErrors = this.gotErrors.bind(this);
    this.accept = this.accept.bind(this);
    this.fetchCases();
  }
  fetchCases() {
    console.log(this.props.authUser);
    var caseFolderRef = this.props.firebase
      .user(this.props.authUser.uid)
      .child("cases/");
    caseFolderRef.once("value").then(this.gotCases, this.gotErrors);
  }
  gotCases(data) {
    var caseList = [];
    var cases = data.val();
    //there is no history cases
    if (!cases) {
      return;
    }

    this.setState({
      cases: cases
    });
  }
  gotErrors(error) {
    console.log("ERROR: ");
    console.log(error);
  }
  accept(
    caseK,
    quoteK,
    acceptedQuote,
    acceptedShopName,
    acceptedAddress,
    acceptedShopId
  ) {
    console.log(caseK);
    console.log(quoteK);
    var quoteRef = this.props.firebase
      .user(this.state.authUser.uid)
      .child("cases/")
      .child(caseK)
      .child("quotes")
      .child(quoteK);
    quoteRef.update({
      accepted: true
    });
    var caseRef = this.props.firebase
      .user(this.state.authUser.uid)
      .child("cases/")
      .child(caseK);
    caseRef.update({
      status: "finished",
      acceptedQuote: acceptedQuote,
      acceptedShopName: acceptedShopName,
      acceptedAddress: acceptedAddress,
      acceptedShopid: acceptedShopId
    });
    window.location.reload();
  }

  render() {
    const caseHistory = Object.entries(this.state.cases).map(
      ([caseK, caseV]) => {
        const images = Object.entries(caseV.urls).map(([urlK, urlV]) => {
          console.log(urlV);
          return <img src={urlV.url}></img>;
        });
        var quotes;
        console.log(caseV.quotes);
        if (caseV.status !== "finished") {
          if (caseV.quotes) {
            quotes = Object.entries(caseV.quotes).map(([quoteK, quoteV]) => {
              return (
                <div>
                  <h4>{quoteV.shopName}</h4>
                  <h4>{quoteV.shopAddress}</h4>
                  <h4>{quoteV.quote}</h4>
                  <button
                    onClick={() => {
                      this.accept(
                        caseK,
                        quoteK,
                        quoteV.quote,
                        quoteV.shopName,
                        quoteV.shopAddress,
                        quoteV.shopid
                      );
                    }}
                  >
                    accept quote
                  </button>
                </div>
              );
            });
          } else {
            quotes = <h4>currently no quotes</h4>;
          }
        } else {
          quotes = (
            <div>
              <h4>{caseV.acceptedShopName}</h4>
              <h4>{caseV.acceptedAddress}</h4>
              <h4>{caseV.acceptedQuote}</h4>
            </div>
          );
        }

        return (
          <div>
            <h3>{caseV.status}</h3>
            <h3>{caseV.description}</h3>
            {images}
            {quotes}
          </div>
        );
      }
    );
    return (
      <div>
        <h1>CASE HISTORY</h1>
        {this.state.cases.length == 0 ? (
          <h1>There is no history case to show</h1>
        ) : null}
        <div>{}</div>
        {caseHistory}
      </div>
    );
  }
}
const CaseHistory = compose(withFirebase, withRouter)(CaseHistoryBase);

const condition = authUser => !!authUser;

const OwnerHomeHistoryLink = () => (
  <div class="link-pos">
    <Link class="link-style" to={ROUTES.OWNER_HOME}>
      Home |
    </Link>
    <Link class="link-style" to={ROUTES.HISTORY}>
      History
    </Link>
  </div>
);

const ShopHomeHistoryLink = () => (
  <div class="link-pos">
    <Link class="link-style" to={ROUTES.SHOP_HOME}>
      Home |
    </Link>
    <Link class="link-style" to={ROUTES.HISTORY}>
      History
    </Link>
  </div>
);

export { OwnerHomeHistoryLink, ShopHomeHistoryLink };

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(History);
