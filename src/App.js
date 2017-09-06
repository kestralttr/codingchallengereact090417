import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      apiToken: "",
      contactData: [],
      selectedID: null
    };

    this.renderOutContacts = this.renderOutContacts.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.composeMessage = this.composeMessage.bind(this);
    this.cancelMessage = this.cancelMessage.bind(this);
    this.revealModalBackground = this.revealModalBackground.bind(this);
    this.hideModalBackground = this.hideModalBackground.bind(this);
    this.revealMessageContainer = this.revealMessageContainer.bind(this);
    this.hideMessageContainer = this.hideMessageContainer.bind(this);
    this.makeSMSRequest = this.makeSMSRequest.bind(this);
    this.makeContactListRequest = this.makeContactListRequest.bind(this);
    this.revealMessageSuccess = this.revealMessageSuccess.bind(this);
    this.hideMessageSuccess = this.hideMessageSuccess.bind(this);
    this.revealMessageFailure = this.revealMessageFailure.bind(this);
    this.hideMessageFailure = this.hideMessageFailure.bind(this);
    this.saveToken = this.saveToken.bind(this);
  }

  componentDidMount() {

  }

  saveToken() {
    let apiToken = $(".token-entry").val();
    this.setState({
      apiToken: apiToken
    }, () => {
      console.log("api token state: ", this.state.apiToken);
      this.makeContactListRequest();
    });
    $(".token-modal-background").addClass("hidden");
    $(".token-modal-container").addClass("hidden");
  }

  makeContactListRequest() {
    $.ajax({
      method:"GET",
      url: "https://stage.skipio.com/api/v2/contacts?token=" + this.state.apiToken + "&page=1",
      success: (data) => {
        this.setState({
          contactData: data['data']
        });
        console.log("this.state.contactData: ", this.state.contactData);
        this.renderOutContacts(data['data']);
      }
    });
  }

  renderOutContacts(contacts) {
    contacts.forEach(function(contact) {
      return(
        <p>{contact.first_name} {contact.last_name}</p>
      );
    });
  }

  composeMessage(id) {

    return (e) => {
      this.revealModalBackground();
      this.revealMessageContainer();
      this.setState({
        selectedID:id
      });
    };
  }

  cancelMessage(e) {
    e.preventDefault();
    this.hideModalBackground();
    this.hideMessageContainer();
    this.hideMessageSuccess();
    this.hideMessageFailure();
    this.setState({
      selectedID:null
    });
  }

  revealModalBackground() {
    $(".modal-background").removeClass("hidden");
  }

  hideModalBackground() {
    $(".modal-background").addClass("hidden");
  }

  revealMessageContainer() {
    $(".message-modal-container").removeClass("hidden");
  }

  hideMessageContainer() {
    $(".message-modal-container").addClass("hidden");
  }

  revealMessageSuccess() {
    $(".message-success").removeClass("hidden");
  }

  hideMessageSuccess() {
    $(".message-success").addClass("hidden");
  }

  revealMessageFailure() {
    $(".message-failure").removeClass("hidden");
  }

  hideMessageFailure() {
    $(".message-failure").addClass("hidden");
  }

  makeSMSRequest(message) {
    let url = "https://stage.skipio.com/api/v2/messages?token=" + this.state.apiToken;

    $.ajax({
      method:"POST",
      url: url,
      dataType: 'text',
      headers: {
        "content-type": 'application/json'
      },
      data: JSON.stringify({
              "recipients": [
                "contact-" + this.state.selectedID
              ],
              "message": {
                "body": message
              }
            }),
      success: (data) => {
        console.log("success");
        console.log(data);
        this.revealMessageSuccess();
        setTimeout( () => {
          this.hideMessageSuccess();
          this.hideModalBackground();
        },1500);
      },
      error: (xhr) => {
        console.log("error");
        console.log(xhr);
        this.revealMessageFailure();
        setTimeout( () => {
          this.hideMessageFailure();
          this.hideModalBackground();
        },1500);
      }
    });
  }

  sendMessage() {
    let message = $(".message-entry").val();
    $(".message-entry").val("");
    this.makeSMSRequest(message);
    this.setState({
      selectedID:null
    });
    this.hideMessageContainer();
  }

  render() {
    return (
      <div className="master-container">
        <h1>Now We Do React!</h1>
        <div className="phone-image"></div>
        <div className="screen-header">
          <h2>React 6</h2>
        </div>
        <div className="modal-background hidden"
          onClick={this.cancelMessage}></div>
        <div className="token-modal-background"></div>
        <div className="token-modal-container">
            <h3>Enter API Token</h3>
            <textarea
              className="token-entry"
              wrap="physical">
            </textarea>
            <div className="save-token-button"
              onClick={this.saveToken}>Save</div>
        </div>

        <div className="message-modal-container hidden">
          <textarea
            className="message-entry"
            maxLength="160"
            wrap="physical">
          </textarea>
          <div className="send-message-button"
            onClick={this.sendMessage}>Send</div>
        </div>
        <div className="message-success hidden">Message Sent!</div>
        <div className="message-failure hidden">Sending Failed</div>
        <div className="contact-master">
          {this.state.contactData.map((contact,idx) => (
            <div key={idx}
              className="contact-line"
              onClick={this.composeMessage(contact.id)}>
              {contact.first_name} {contact.last_name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
