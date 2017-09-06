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
      selectedContact: null,
      isComposing: false
    };

    this.renderOutContacts = this.renderOutContacts.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
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

  sendMessage(id, message) {
    let url = "https://stage.skipio.com/api/v2/messages?token=" + this.state.apiToken;
    message = "test";
    return function(e) {
      console.log(id);


      $.ajax({
        method:"POST",
        url: url,
        dataType: "json",
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
          console.log(data);
        },
        error: (xhr) => {
          console.log("Status Code: ", xhr.status);
          console.log("Error Text: ", xhr.responseText);
        }
      });

    };
  }

  render() {
    return (
      <div className="master-container">
        <h1>Now We Do React!</h1>
        <div className="contact-master">
          {this.state.contactData.map((contact,idx) => (
            <div key={idx}
              onClick={this.sendMessage(contact.id)}>
              {contact.first_name} {contact.last_name}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
