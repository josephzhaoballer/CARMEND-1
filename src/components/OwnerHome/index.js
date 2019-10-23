import React, { Component } from 'react';
const axios = require('axios');

class OwnerHome extends Component{
    state = {
        fileURL : [],
        selectedFile:[]
    }
    onChangeFileSelector = (event)=>{
        if(!event.target.files[0]){
            return;
        }
        console.log("file selected");
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = ()=>{
            this.setState({
                selectedFile:[...this.state.selectedFile,file],
                fileURL:[...this.state.fileURL,reader.result]
            });
        };
        reader.readAsDataURL(file);
        
        //console.log("url"+url);
        // this.setState({
        //     selectedFile:[...this.state.selectedFile,event.target.files[0]],
        //     fileURL: [...this.state.fileURL,url]
        // })
        
    }
    onChangeUpload = ()=>{
        for(var i =0;i<this.state.selectedFile.length;i++){
            const fd = new FormData();
            fd.append('image',this.state.selectedFile[i],this.state.selectedFile[i].name);
            console.log("file created");
            axios.post('https://us-central1-carmend-52299.cloudfunctions.net/uploadMedia',fd)
            .then(res=>{
                console.log(res);
            })
            .catch(error=>{
                console.log(error);
            });
        }
        

    }

    
    render(){
        var result = [];
        for(var i = 0;i<this.state.fileURL.length;i++){
            console.log("here")
            var url = this.state.fileURL[i];
            console.log(url);
            result.push(<img id = {i} src={url} width = {300} height = {500}/>)
        }
        return(
            
            <div>
                <h1>home of car owner</h1>
                    {result}
                    <input type = "file" onChange = {this.onChangeFileSelector}></input>
                    <button onClick ={this.onChangeUpload}>upload</button>
                
                
                
            </div>
        );
    }
}
export default OwnerHome;