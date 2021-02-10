import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles, Typography } from "@material-ui/core";
import ChatMessage from "@mui-treasury/components/chatMsg/ChatMsg";
import ChadIcon from "../../../static/movie_robot.png";

const styles = () => ({
  root: {
    margin: "auto",
    marginTop: "1em",
    width: "95%",
    maxWidth: 1000,
    minHeight: "calc(100vh - 12em)",
    maxHeight: "calc(100vh - 12em)",
    overflowY: "auto",
    overflowX: "hidden",
  },
});
@inject("store")
@observer
class MessageList extends React.Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    this.el.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    const {
      store: { feed, botTyping },
      classes,
    } = this.props;

    return (
      <div className={classes.root}>
        {feed.map((message) => (
          <ChatMessage
            key={message.id}
            side={message.position}
            avatar={message.position === "left" ? ChadIcon : null}
            messages={[message.text]}
          />
        ))}
        {botTyping ? <Typography variant="caption">Chad is typing ...</Typography> : null}
        <div
          ref={(el) => {
            this.el = el;
          }}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MessageList);
