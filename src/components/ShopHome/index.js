import React, { Component } from "react";

import { compose } from "recompose";

import { withAuthorization, withEmailVerification } from "../Session";

import { withFirebase } from "../Firebase";
class ShopHome extends Component {
  render() {
    return (
      
      <h1>shop home</h1>

    );
  }
}
const condition = authUser => !!authUser;
export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(ShopHome);
