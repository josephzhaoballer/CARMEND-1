import React, { Component } from "react";
import { compose } from "recompose";
import {
	AuthUserContext,
	withAuthorization,
	withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";

import ImageUpload from "../ImageUpload/ImageUpload.js";
import mainLogo from '../../assets/logo.png';

const axios = require("axios");

const OwnerHome = () => (
	<section class = "main-section">
  <div class= "split-horizontal-border"> </div>
  <div class = "main-text" >Home | History</div> 
  
  <div class= "split-horizontal"> </div>

  <br></br>
  <div class= "main-text"><i>Welcome, Car Owner</i></div>

  <div class = "landing-logo-position">
  <img src = {mainLogo} class="landing-logo-att" /> 
  </div>
  
	<AuthUserContext.Consumer>
		{authUser => <SubmitNewCase authUser={authUser} />}
	</AuthUserContext.Consumer>
	</section>
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

	onChangeFileSelector = (event) => {
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
	}
	onChangeSubmit = () => {
		const typeOfDamage = this.state.typeOfDamage;
		var caseFolderRef = this.props.firebase.user(this.props.authUser.uid).child("cases/");
		var caseRef = caseFolderRef.push({
			description: typeOfDamage,
			status: "created"
		});
		for (var i = 0; i < this.state.selectedFile.length; i++) {
			const fd = new FormData();
			fd.append('image', this.state.selectedFile[i], this.state.selectedFile[i].name);
			console.log("file created");
			axios.post('https://us-central1-carmend-52299.cloudfunctions.net/uploadMedia', fd)
				.then(res => {
					console.log(res);
					console.log(res.data.url);
					caseRef.child("urls/").push({ url: res.data.url });
				})
				.catch(error => {
					console.log(error);
				});
		}


	}
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
			console.log("here");
			var url = this.state.fileURL[i];
			console.log(url);
			result.push(<img id={i} src={url} width={300} height={500} />);
		}
		return (
			<div>
				<div>
				<br>
				</br>
				<div class= "main-text">Type of Damage: 
					<input
						name="typeOfDamage"
						type="text"
						value={typeOfDamage}
						onChange={this.onChangeTextBox}
					></input>
				</div></div>

				{result}
				<input type="file" onChange={this.onChangeFileSelector}></input>
				<button onClick={this.onChangeSubmit}>Submit</button>
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
  

  

