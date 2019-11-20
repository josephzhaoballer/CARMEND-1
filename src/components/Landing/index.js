import React from "react";
import { LandingSignUpButton } from "../SignUp";
import { LandingSignInButton } from "../SignIn";

import "./LandingStyle.css";
import mainLogo from "../../assets/logo.png";

const Landing = () => (
  <section class="landing-section">
    <div>
      <div class="landing-logo-position">
        <img src={mainLogo} class="landing-logo-att" />
      </div>

      <div class="landing-text">
        PLEASE LOGIN OR SIGNUP TO GET A
        <br />
        QUOTE ON MENDING YOUR CAR'S DAMAGE
      </div>

      <div class="signup-button-pos">
        <LandingSignUpButton />
      </div>

      <div class="split-horizontal-border"></div>

      <div class="signin-button-pos">
        <LandingSignInButton />
      </div>
    </div>
  </section>
);

export default Landing;
