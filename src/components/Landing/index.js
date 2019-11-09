import React from 'react';
import { LandingSignUpButton } from '../SignUp';
import { LandingSignInButton } from '../SignIn';

import './LandingStyle.css';
import mainLogo from '../../assets/logo.png';

const Landing = () => (
  <section class="landing-section">
    <div>
      <div class="landing-logo-position">
        <img src={mainLogo} class="landing-logo-att" />
      </div>

    <div class = "description"> Carmend is the latest car repair shop application that bridges the gap between vehicle users and body shop owners. </div>

    <div class = "description"> Skip the repair shop line and get an instant quote today.  </div>

      <div class="landing-text">
        PLEASE LOGIN OR SIGNUP TO GET A
        <br />
        QUOTE ON MENDING YOUR CAR'S DAMAGE
      </div>
      
      <div class="signup-button-pos">
        <LandingSignUpButton/>
      </div>

      <div class= "split-horizontal-border">
      </div>

      <div class="signin-button-pos">
        <LandingSignInButton />
      </div>


    </div>
  </section>
);

export default Landing;
