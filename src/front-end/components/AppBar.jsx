import React from "react";
import {
  withStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@material-ui/core";

const styles = (theme) => ({
  root: { flexGrow: 1 },
  menuButton: { marginRight: theme.spacing(2) },
  title: { flexGrow: 1 },
});

class Appbar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Chad bot
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Appbar);
