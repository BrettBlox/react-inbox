import React, { Component } from "react";
import "./App.css";
import Toolbar from "./Toolbar";
import ComposeMessage from "./ComposeMessage";
import MessagesList from "./MessagesList";

export default class App extends Component {
  state = {
    messages: []
  };

  //GET request to the API
  request = async (method = "GET", body = null) => {
    if (body) body = JSON.stringify(body);
    return await fetch("http://localhost:8082/api/messages", {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: body
    });
  };

  componentDidMount = async () => {
    this.getMessages();
  };

  getMessages = async () => {
    const response = await fetch(`http://localhost:8082/api/messages`);
    const json = await response.json();
    this.setState({
      ...this.state,
      messages: json
    });
  };

  //PATCH route with new payload
  updateMessages = async payload => {
    await this.request("PATCH", payload);
  };

  //toggles messages property to opposite value
  toggleMessageProperty = (message, property) => {
    const index = this.state.messages.indexOf(message);
    this.setState({
      messages: [
        ...this.state.messages.slice(0, index),
        { ...message, [property]: !message[property] },
        ...this.state.messages.slice(index + 1)
      ]
    });
  };

  //toggles star and updates state
  toggleStar = async message => {
    await this.updateMessages({
      messageIds: [message.id],
      command: "star",
      star: message.starred
    });
    this.toggleMessageProperty(message, "starred");
  };

  //toggles selected messages in inbox
  toggleSelect = async message => {
    this.toggleMessageProperty(message, "selected");
  };

  //selects all messages in inbox with select-all button
  toggleSelectAll = () => {
    const selectedMessages = this.state.messages.filter(
      message => message.selected
    );
    const selected = selectedMessages.length !== this.state.messages.length;
    this.setState({
      messages: this.state.messages.map(message =>
        message.selected !== selected ? { ...message, selected } : message
      )
    });
  };

  // handles marking messages as read and updates state
  markRead = async () => {
    await this.updateMessages({
      messageIds: this.state.messages
        .filter(message => message.selected)
        .map(message => message.id),
      command: "read",
      read: true
    });
    this.setState({
      messages: this.state.messages.map(message =>
        message.selected ? { ...message, read: true } : message
      )
    });
  };

  //opposite of markRead
  markUnread = async () => {
    await this.updateMessages({
      messageIds: this.state.messages
        .filter(message => message.selected)
        .map(message => message.id),
      command: "read",
      read: false
    });

    this.setState({
      messages: this.state.messages.map(message =>
        message.selected ? { ...message, read: false } : message
      )
    });
  };

  //function for deleting messages
  deleteMessages = async () => {
    await this.updateMessages({
      messageIds: this.state.messages
        .filter(message => message.selected)
        .map(message => message.id),
      command: "delete"
    });

    const messages = this.state.messages.filter(message => !message.selected);
    this.setState({ messages });
  };

  addLabel = async label => {
    await this.updateMessages({
      messageIds: this.state.messages
        .filter(message => message.selected)
        .map(message => message.id),
      command: "addLabel",
      label: label
    });

    const messages = this.state.messages.map(message =>
      message.selected && !message.labels.includes(label)
        ? { ...message, labels: [...message.labels, label].sort() }
        : message
    );
    this.setState({ messages });
  };

  removeLable = async label => {
    await this.updateMessages({
      messageIds: this.state.messages
        .filter(message => message.selected)
        .map(message => message.id),
      command: "removeLabel",
      label: label
    });
    const messages = this.state.messages.map(message => {
      const index = message.labels.indexOf(label);
      if (message.selected && index > -1) {
        return {
          ...message,
          labels: [
            ...message.labels.slice(0, index),
            ...message.labels.slice(index + 1)
          ]
        };
      }
      return message;
    });
    this.setState({ messages });
  };

  // Shows/Hides the compose component.
  toggleCompose = () => {
    this.setState({ composing: !this.state.composing });
  };

  sendMessage = async message => {
    const response = await this.request("POST", {
      subject: message.subject,
      body: message.body
    });
    const newMessage = await response.json();

    const messages = [...this.state.messages, newMessage];
    this.setState({
      messages,
      composing: false
    });
  };

  render() {
    return (
      <div>
        <div className="navbar navbar-default" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target=".navbar-collapse"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="/">
                Brett's React Inbox
              </a>
            </div>
          </div>
        </div>

        <div className="container">
          <Toolbar
            messages={this.state.messages}
            markAsRead={this.markRead}
            markAsUnread={this.markUnread}
            deleteMessages={this.deleteMessages}
            toggleSelectAll={this.toggleSelectAll}
            toggleCompose={this.toggleCompose}
            applyLabel={this.addLabel}
            removeLabel={this.removeLabel}
          />
          {this.state.composing ? (
            <ComposeMessage sendMessage={this.sendMessage} />
          ) : null}
          <MessagesList
            messages={this.state.messages}
            toggleSelect={this.toggleSelect}
            toggleStar={this.toggleStar}
          />
        </div>
      </div>
    );
  }
}
