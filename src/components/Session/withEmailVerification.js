import React from "react";
import "./EmailVerification.css";
import mainLogo from "../../assets/logo.png";

import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes("password");

const withEmailVerification = Component => {
  class WithEmailVerification extends React.Component {
    constructor(props) {
      super(props);

      this.state = { isSent: false };
    }

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            needsEmailVerification(authUser) ? (
              <div class="email-ver-section">
                <div class="signup-logo-position">
                  <img src={mainLogo} class="signup-logo-att" />
                </div>
                {this.state.isSent ? (
                  <p>
                    Your email confirmation has been resent. <br />
                    <br />
                    Check your all your emails (including the Spam folder) for
                    the confirmation.
                    <br /> <br />
                    Please refresh this page and click the button again if you
                    do not receive a confirmation.
                  </p>
                ) : (
                  <p>
                    Thank you for signing up! <br />
                    <br />
                    Please check your emails for the confirmation (including the
                    Spam folder) or <br />
                    click the button to send another confirmation email.
                    <br />
                    <br /> Refresh this page once you confirmed your email.
                  </p>
                )}

                <button
                  class="resend-button"
                  type="button"
                  onClick={this.onSendEmailVerification}
                >
                  Resend Confirmation Email
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(WithEmailVerification);
};

export default withEmailVerification;
