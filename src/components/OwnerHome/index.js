import React, { Component } from "react";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import SignOutButton from "../SignOut";

import mainLogo from "../../assets/logo.png";
import "./OwnerHome.css";

const axios = require("axios");

const OwnerHome = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => (
        <section class="owner-section">
          <div class="owner-logo-position">
            <img src={mainLogo} class="owner-logo-att" />
          </div>
          <div class="welcome-text">
            <i>Welcome, {authUser.email}</i>
          </div>
          <SubmitNewCase authUser={authUser} />
          <div class="upload-section">
            <SignOutButton />
          </div>
        </section>
      )}
    </AuthUserContext.Consumer>
  </div>
);
class SubmitNewCaseBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      fileURL: [],
      selectedFile: [],
      typeOfDamage: ""
    };
  }

  onChangeFileSelector = event => {
    if (!event.target.files[0]) {
      return;
    }
    console.log("file selected");
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        selectedFile: [...this.state.selectedFile, file],
        fileURL: [...this.state.fileURL, reader.result]
      });
    };
    reader.readAsDataURL(file);
  };
  onChangeSubmit = () => {
    const typeOfDamage = this.state.typeOfDamage;
    var caseFolderRef = this.props.firebase
      .user(this.props.authUser.uid)
      .child("cases/");
    var caseRef = caseFolderRef.push({
      description: typeOfDamage,
      status: "created"
    });
    for (var i = 0; i < this.state.selectedFile.length; i++) {
      const fd = new FormData();
      fd.append(
        "image",
        this.state.selectedFile[i],
        this.state.selectedFile[i].name
      );
      console.log("file created");
      axios
        .post(
          "https://us-central1-carmend-52299.cloudfunctions.net/uploadMedia",
          fd
        )
        .then(res => {
          console.log(res);
          console.log(res.data.url);
          caseRef.child("urls/").push({ url: res.data.url });
        })
        .catch(error => {
          console.log(error);
        });
    }
  };
  //remove order: LIFO
  onChangeDelete = () => {
    var selectedFileArray = [...this.state.selectedFile];
    var fileURLArray = [...this.state.fileURL];
    selectedFileArray.splice(selectedFileArray.length - 1);
    fileURLArray.splice(fileURLArray.length - 1);
    this.setState({
      selectedFile: [...selectedFileArray],
      fileURL: [...fileURLArray]
    });
  };
  componentWillMount() {
    console.log(this.props.authUser);
  }
  onChangeTextBox = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const typeOfDamage = this.state.typeOfDamage;
    var result = [];
    for (var i = 0; i < this.state.fileURL.length; i++) {
      var url = this.state.fileURL[i];
      console.log(url);
      result.push(<img id={i} src={url} class="image-upload" />);
    }
    return (
      <div>
        <div>
          <div class="damage-text">
            Type of Damage:
            <input
              name="typeOfDamage"
              type="text"
              class="owner-textarea"
              placeholder="ie cracked bumper"
              value={typeOfDamage}
              onChange={this.onChangeTextBox}
            ></input>
          </div>
        </div>
        <div class="upload-section">
          {result}

          <div class="upload-input">
            <label for="file-upload" class="custom-file-upload">
              Upload
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={this.onChangeFileSelector}
            />
          </div>
          <div class="upload-section-buttons">
            <button class="upload-remove" onClick={this.onChangeDelete}>
              remove
            </button>
            <button class="upload-submit" onClick={this.onChangeSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
}
const SubmitNewCase = withFirebase(SubmitNewCaseBase);

const condition = authUser => !!authUser;

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(OwnerHome);
