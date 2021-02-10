import React from "react";
import { inject, observer } from "mobx-react";
import { FaTelegramPlane } from "react-icons/fa";
import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";

const styles = (theme) => ({
  root: {
    margin: "auto",
    position: "relative",
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: "90%",
    maxWidth: 750,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
});

@inject("store")
@observer
class InputBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  updateMessage = (message) => {
    this.setState({
      message: message,
    });
  };

  render() {
    const { classes, store } = this.props;
    const { message } = this.state;

    return (
      <Paper className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={
            store.botTyping
              ? "Wait for Chad to stop typing ..."
              : store.conversationTerminated
              ? "Please return to Qualtrics"
              : "Say something!"
          }
          value={message}
          disabled={store.botTyping || store.conversationTerminated}
          onChange={(event) => this.updateMessage(event.target.value)}
          onKeyPress={(event) => {
            if (event.target.value && event.key === "Enter") {
              store.sendMessage(event.target.value);
              this.updateMessage("");
            }
          }}
        />
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton
          color="primary"
          className={classes.iconButton}
          aria-label="directions"
          disabled={store.botTyping || store.conversationTerminated}
          onClick={() => {
            if (message) {
              store.sendMessage(message);
              this.updateMessage("");
            }
          }}
        >
          <FaTelegramPlane />
        </IconButton>
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(InputBar);
