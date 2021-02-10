import React from "react";
import { Provider } from "mobx-react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import store from "./store";
import App from "./components/App";

const theme = createMuiTheme({});

class Application extends React.Component {
  async componentDidMount() {
    await store.identify();
    await store.retrieveWelcomeMessage();
  }

  render() {
    const stores = { store };
    return (
      <ThemeProvider theme={theme}>
        <Provider {...stores}>
          <App />
        </Provider>
      </ThemeProvider>
    );
  }
}

export default Application;
