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


const QuoteHistory = () => (
  <AuthUserContext.Consumer>
    {authUser => <QuotedJobs authUser={authUser} />}
  </AuthUserContext.Consumer>
);
class QuotedJobsBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: this.props.authUser,
      latitude: null,
      longitude: null,
      shopName:"",
      WaitingJobList:[],
      FinishedJobList:[],
      RejectedJobList:[]
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
    console.log(data.val());
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
    var FinishedJobList = [];
    var WaitingJobList = [];
    var RejectedJobList = [];
    var FilteredList = await this.filterUsers();
    console.log(FilteredList);
    for (var userKey in FilteredList) {
      console.log(userKey);
      var user = FilteredList[userKey];
      console.log(user);
      for (var jobKey in user.cases) {
        var job = user.cases[jobKey];
        console.log(job);
        if(!job.quotes){
          continue;//there is currently no quote for this job
        }
        if(job.status === "finished"){
          console.log(job.acceptedShopid);
          console.log(this.state.authUser.uid);
          if(job.acceptedShopid===this.state.authUser.uid){//job is closed and your quote is accepted
            var newFinishedJob = {...job};
            newFinishedJob.ownerName = user.username;
            FinishedJobList.push(newFinishedJob);
          }else{//job is closed and your quote is rejected
            Object.entries(job.quotes).map(([quoteK,quoteV])=>{
              if(quoteV.shopid === this.state.authUser.uid){
                RejectedJobList.push(job);
              }
            });
          } 
        }else{//job still open
          Object.entries(job.quotes).map(([quoteK,quoteV])=>{
            console.log(quoteV);
            if(quoteV.shopid === this.state.authUser.uid){
              WaitingJobList.push(job);//this shop has quoted for this job but car owner hasn't accepted any quote

            }
          });
        }
      }
    }
    console.log(WaitingJobList);
    console.log(FinishedJobList);
    this.setState({
      FinishedJobList:[...FinishedJobList],
      WaitingJobList:[...WaitingJobList],
      RejectedJobList:[...RejectedJobList]
    });
  }

  render() {
    var waiting = this.state.WaitingJobList.map((job)=>{
      var images = Object.entries(job.urls).map(([urlK,urlV])=>{
        return <img src={urlV.url}></img>;
      });
      var yourQuote;
      var yourDiagnosis;
      var lowestQuote = Number.MAX_SAFE_INTEGER;
      Object.entries(job.quotes).map(([quoteK,quoteV])=>{
        if(quoteV.shopid===this.state.authUser.uid){
          yourQuote = quoteV.quote;
          yourDiagnosis = quoteV.diagnosis;
        }
        lowestQuote = Math.min(lowestQuote,quoteV.quote);
      });
      var lowest = <h3>lowest: {lowestQuote}</h3>;
      var youAreLowest = <h3>Your Quote is the Lowest</h3>;
      return (
      <div>
        <h2>{job.description}</h2>
        {images}
        <h3>yourDiagnosis: {yourDiagnosis}</h3>
        <h3>yourQuote: {yourQuote}</h3>
        {lowestQuote==yourQuote?youAreLowest:lowest}
      </div>
      );
    });
    var Finished = this.state.FinishedJobList.map((job)=>{
      var images = Object.entries(job.urls).map(([urlK,urlV])=>{
        return <img src={urlV.url}></img>;
      });
      var description = job.description;
      var yourQuote = job.acceptedQuote;
      var ownerName = job.ownerName;
      return(
        <div>
          <h3>Owner's Name: {ownerName}</h3>
          <h3>Description: {description}</h3>
          {images}
          <h3>yourQuote: {yourQuote}</h3>
        </div>
      )
    })
    var rejected = this.state.RejectedJobList.map((job)=>{
      var images = Object.entries(job.urls).map(([urlK,urlV])=>{
        return <img src={urlV.url}></img>;
      });
      var description = job.description;
      var yourDiagnosis;
      var yourQuote;
      Object.entries(job.quotes).map(([quoteK,quoteV])=>{
        if(quoteV.shopid===this.state.authUser.uid){
          yourQuote = quoteV.quote;
          yourDiagnosis = quoteV.diagnosis;
        }
      });
      return(
        <div>
          <h3>Description: {description}</h3>
          {images}
          <h3>yourDiagnosis: {yourDiagnosis}</h3>
          <h3>yourQuote: {yourQuote}</h3>
          <h3>Accepted Quote: {job.acceptedQuote}</h3>
        </div>
      );

    });

    

    return (
      <div>
        <h1>{this.state.shopName}</h1>
        <h1>Quote History</h1>
        <h1>Waiting: </h1>
        {waiting}
        <h1>Finished: </h1>
        {Finished}
        <h1>Rejected: </h1>
        {rejected}
      </div>
    );
  }
}
const QuotedJobs = withFirebase(QuotedJobsBase);

const condition = authUser => !!authUser;


export default compose(
  withEmailVerification,
  withAuthorization(condition)
)(QuoteHistory);
