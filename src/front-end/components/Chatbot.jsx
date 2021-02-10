import React from "react";
import { withStyles } from "@material-ui/core";
import InputBar from "./InputBar";
import MessageList from "./MessageList";

const styles = () => ({});

class Chatbot extends React.Component {
  render() {
    return (
      <div>
        <MessageList />
        <InputBar />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Chatbot);
