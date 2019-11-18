import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";
import OwnerHome from "../OwnerHome"
import ShopHome from "../ShopHome"
import History from "../History"
import Details from "../Details";
import QuoteHistory from "../QuoteHistory";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";

const App = () => (
  <Router>
    <div>
      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
      <Route path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.OWNER_HOME} component = {OwnerHome}/>
      <Route path={ROUTES.SHOP_HOME} component = {ShopHome}/>
      <Route path={ROUTES.HISTORY} component = {History}/>
      <Route path={ROUTES.DETAILS} component = {Details}/>
      <Route path={ROUTES.QUOTEHISTORY} component = {QuoteHistory}/>
    </div>
  </Router>
);

export default withAuthentication(App);
