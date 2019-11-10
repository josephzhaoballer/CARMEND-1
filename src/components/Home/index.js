import React from "react";
import { compose } from "recompose";
import SignOutButton from "../SignOut";
import './HomeStyle.css';

import { withAuthorization, withEmailVerification } from "../Session";
import Messages from "../Messages";
import mainLogo from '../../assets/logo.png';

const HomePage = () => (
  
  
  <section class = "main-section">
  <div>
  <div class= "split-horizontal-border"> </div>

  <div class = "main-text" >Home | History</div> 
  
  <div class= "split-horizontal"> </div>

  <div class="landing-logo-position">
  <img src = {mainLogo} class="landing-logo-att" />

  </div>

  <p>The Home Page is accessible by every signed in user.</p>
  <SignOutButton />
</div>

  
  </section>

  
);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(HomePage);
