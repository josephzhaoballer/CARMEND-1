import React, { Component } from "react";
import { compose } from "recompose";
import {
	AuthUserContext,
	withAuthorization,
	withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";


const History = () => (
	<AuthUserContext.Consumer>
		{authUser => <CaseHistory authUser={authUser} />}
	</AuthUserContext.Consumer>
);
class CaseHistoryBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authUser: this.props.authUser,
			cases:[],
			typeOfDamage: ""
        };
        this.fetchCases = this.fetchCases.bind(this);
        this.gotCases = this.gotCases.bind(this);
        this.gotErrors = this.gotErrors.bind(this);
        this.fetchCases();

    }
    fetchCases(){
        console.log(this.props.authUser);
        var caseFolderRef = this.props.firebase.user(this.props.authUser.uid).child("cases/");
        caseFolderRef.once("value").then(this.gotCases,this.gotErrors);

    }
    gotCases(data){
        var caseList = [];
        var cases = data.val();
        var keysOfCases = Object.keys(cases);
        for(var i = 0;i<keysOfCases.length;i++){
            
            var k = keysOfCases[i];
            var c = cases[k];
            var newCase ={
                description: c.description,
                status:c.status,
                urls: []
            }
            //console.log(c.description);
            var keysOfUrls = Object.keys(c.urls);
            for(var j = 0;j<keysOfUrls.length;j++){
                var kOfU = keysOfUrls[j];
                var url = c.urls[kOfU];
                newCase.urls.push(url.url);
                //console.log(url.url);
            }
            caseList.push(newCase);
        }
        this.setState({
            cases:[...caseList]
        });
    }
    gotErrors(error){
        console.log("ERROR: ")
        console.log(error);
    }

	render() {
        const caseHistory = this.state.cases.map((c)=>{
            const images = c.urls.map((url)=>{
                console.log(url);
                return <img src={url}></img>;
            })
            
            return (
                <div>
                <h3>{c.status}</h3>
                <h3>{c.description}</h3>
                {images}
                </div>
            );
        });
		return (
			<div>
				<h1>CASE HISTORY</h1>
                <div>
                    {
                        
                    }
                </div>
                {caseHistory}
			</div>
		);
	}
}
const CaseHistory = withFirebase(CaseHistoryBase);

const condition = authUser => !!authUser;
const CaseBlock = () =>{

}

export default compose(
	withEmailVerification,
	withAuthorization(condition)
)(History);
