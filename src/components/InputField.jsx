import React, { Component } from 'react';
import {
  isUserSignedIn,
  putFile, 
  getFile
} from 'blockstack';


// import { Link } from 'react-router-dom';
// const blockstack = require('blockstack');

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ''
      // storedData: null
    };


    // why is it done this way??
    this.onTextChange = this.onTextChange.bind(this);
    this.saveNewFile = this.saveNewFile.bind(this);
    this.loadFile = this.loadFile.bind(this);
  }

  componentWillMount() {
    this.loadFile(function(storedData) {
      console.log(storedData)
    })
  }

  onTextChange(event) {
    this.setState({
      content: event.target.value
    });
  }

  saveNewFile() {
    if (!this.state.content) {
      alert('Textbox cannot be blank.');
      return
    }

    this.loadFile(function(fileContents) {
      this.saveFile(this.appendContent(fileContents))
    }.bind(this))
  
  }



  appendContent(fileContents) {
    let newFileContents = fileContents + ' + ' + this.state.content
    console.log(newFileContents)
    return newFileContents
  }

  saveFile(fileContents) {
    let options = { 
      encrypt: true 
    }

    putFile(this.props.storageLocation, fileContents, options)
    .then(() => {
      this.props.updateData(fileContents)
      this.state.content = ''
    }).catch((e) => {
      console.log('e');
      console.log(e);
      alert(e.message);
    });
  }

  loadFile(callback) {
    let options = { 
      decrypt: true 
    }

    getFile(this.props.storageLocation, options)
    .then((fileContents) => {
      this.props.updateData(fileContents)
      if(callback) {
        callback(fileContents)
      } 
      
    }).catch((e) => {
      console.log('e');
      console.log(e);
      alert(e.message);
    });
  }


  render() {
    if (!isUserSignedIn()) {
      return (
        <p>sign in motha fucka</p>
      );
    }

    return (
      <div>
        <input
          type="text"
          onChange={this.onTextChange}
          value={this.state.content}
        />
        <button
          onClick={this.saveNewFile}
        >Save</button>
        <br/>
        <br/>
        <button
          onClick={() => {this.loadFile()}}
        >Get Past Content</button>
      </div>
    );
  }
}

export default InputForm;
