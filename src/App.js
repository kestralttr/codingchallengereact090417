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
  }

  componentDidMount() {
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
      console.log("composing");
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

  sendMessage(id, message) {
    let url = "https://stage.skipio.com/api/v2/messages?token=" + this.state.apiToken;
    message = "test";
    return function(e) {
      console.log(id);

      $.ajax({
        method:"GET",
        url: url,
        headers: {
          "content-type": 'application/json'
        },
        data: JSON.stringify({
                "recipients": [
                  "contact-00a08e17-b73f-446d-a3b7-17386be3d2e0"
                ],
                "message": {
                  "body": "alo"
                }
              }),
        success: (data) => {
          console.log("success");
          console.log(data);
        },
        error: (xhr) => {
          console.log("error");
          console.log(xhr);
        }
      });

    };
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
        <div className="message-modal-container hidden">
          <textarea
            className="message-entry"
            maxLength="160"
            wrap="physical">
          </textarea>
          <div className="send-message-button">Send</div>
        </div>
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
