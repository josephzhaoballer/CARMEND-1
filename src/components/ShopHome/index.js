import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";
import {
  AuthUserContext,
  withAuthorization,
  withEmailVerification
} from "../Session";
import { withFirebase } from "../Firebase";
import * as ROLES from "../../constants/roles";


const ShopHome = () => (
  <AuthUserContext.Consumer>
    {authUser => <JobList authUser={authUser} />}
  </AuthUserContext.Consumer>
);
class JobListBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      jobs: [],
      typeOfDamage: "",
      latitude: null,
      longitude: null,
      users: [],
      shopName:""
    };
    this.fetchUsers = this.fetchUsers.bind(this);
    this.gotUsers = this.gotUsers.bind(this);
    this.userError = this.userError.bind(this);
    this.fetchLocation = this.fetchLocation.bind(this);
    this.gotLocation = this.gotLocation.bind(this);
    this.locationError = this.locationError.bind(this);
    this.fetchDistance = this.fetchDistance.bind(this);
    this.filterUsers = this.filterUsers.bind(this);
    this.filterCases = this.filterCases.bind(this);
    //this.fetchDistance();
    this.fetchLocation();
    this.filterCases();


  }
  fetchLocation() {
    var userRef = this.props.firebase.user(this.props.authUser.uid);
    userRef.once("value").then(this.gotLocation, this.LocationError);
  }
  gotLocation(data) {
    this.setState({
      longitude: data.val().longitude,
      latitude: data.val().latitude,
      shopName: data.val().shopName
    });

  }
  locationError() {

  }
  fetchDistance() {
    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=37.2981753,-121.8679479&destinations=37.32017099999999,-121.976599&key=AIzaSyA2eIKJXi2Gzs4RVVlH2wKAB6h7i51jvRw`)
      .then(data => {
        console.log(data.json());
      })
  }
  fetchUsers() {
    var ref = this.props.firebase.users();
    ref.once("value").then(this.gotUsers, this.userError);

  }
  async gotUsers() {
    var ref = this.props.firebase.users();
    var data = await ref.once("value")

    console.log(data.val());
    if (!data.val()) {
      return;
    }
    var UserList = {};
    var users = data.val();
    var keysOfUsers = Object.keys(users);
    for (var i = 0; i < keysOfUsers.length; i++) {

      var keyOfUser = keysOfUsers[i];//userid
      var user = users[keyOfUser];
      if (user.role === ROLES.OWNER) {
        UserList[keyOfUser] = user;
      }
    }
    console.log(UserList);
    return UserList;
  }
  userError(error) {
    console.log("ERROR: ")
    console.log(error);
  }
  async filterUsers() {
    console.log("in filteruser");
    var unfilteredList = await this.gotUsers();
    console.log(unfilteredList);
    for (var key in unfilteredList) {
      var user = unfilteredList[key];
      await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${this.state.latitude},${this.state.longitude}&destinations=${user.latitude},${user.longitude}&key=AIzaSyA2eIKJXi2Gzs4RVVlH2wKAB6h7i51jvRw`)
        .then(response => { return response.json(); }
        )
        .then((json) => {
          console.log(json.rows[0].elements[0].distance.value);
          if (json.rows[0].elements[0].distance.value > 16000) {//10 miles
            delete unfilteredList[key];
          }
        })
        .catch(error => {
          console.log(error);
        })
    };
    console.log(unfilteredList);
    return unfilteredList;
  }
  async filterCases() {
    var FilteredList = await this.filterUsers();
    console.log(FilteredList);
    for (var userKey in FilteredList) {
      console.log(userKey);
      var user = FilteredList[userKey];
      console.log(user);
      for (var jobKey in user.cases) {
        var job = user.cases[jobKey];
        console.log(job);
        if (job.status !== "created") {
          delete user.cases[jobKey];
        }
        if(job.quotes){
          Object.entries(job.quotes).map(([quoteK,quoteV])=>{
            if(quoteV.shopid === this.state.authUser.uid){
              delete user.cases[jobKey];
            }
          });
        }
        if (Object.entries(user.cases).length === 0) {
          delete FilteredList[userKey];
        }
      }
    }
    console.log(FilteredList);
    this.setState({
      users: FilteredList
    });
  }

  render() {
    console.log(this.state.users);
    var caseHistory;
    if (this.state.users) {
      caseHistory = Object.entries(this.state.users).filter(([userK,userV])=>{
        return userV.cases;
      }).map(([userK, userV]) => {
         const jobs = Object.entries(userV.cases).map(([caseK, caseV]) => {
          var urlList = [];
          const images = Object.entries(caseV.urls).map(([urlK, urlV]) => {
            urlList.push(urlV);
            return <img src={urlV.url}></img>;
          })

          return (
            <div>
              <h3>{caseV.description}</h3>
              {images}
              <Link to={{ pathname : '/details',state:{uid:userK,cid:caseK,urls:urlList,desc:caseV.description}}}>View Detail</Link>
            </div>
          );
        });
        return jobs;

      });
    } else {
      caseHistory = [];
    }
    console.log(caseHistory);
    var emptyJobList = <h3>there is no job available</h3>
    return (
      <div>
        <h1>{this.state.shopName}</h1>
        <div>
          {

          }
        </div>
        {caseHistory.length!==0? caseHistory:emptyJobList}
      </div>
    );
  }
}
const JobList = withFirebase(JobListBase);

const condition = authUser => !!authUser;
const CaseBlock = () => {

}

export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(ShopHome);
