import "../css/reset.css";
import React from "react";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";
import AppBar from "./AppBar";
import Chatbot from "./Chatbot";

const styles = () => ({
  root: {
    margin: "auto",
    marginTop: "1em",
    width: "95%",
    maxWidth: 1000,
  },
});

@inject("store")
@observer
class Main extends React.Component {
  render() {
    const { store } = this.props;

    return (
      <div>
        <AppBar />
        {(() => {
          switch (store.page) {
            case "bot":
              return <Chatbot />;
            default:
              return `${store.page} page not found.`;
          }
        })()}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Main);
