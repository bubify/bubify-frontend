import { Container, Grid, Paper, Theme, withStyles } from "@material-ui/core";
import React from "react";
import QualityOfServiceCard from "../qualityOfServiceCard";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

const styles = (theme: Theme) => ({
  root: {
    marginLeft: "0px",
    height: "100%",
  },
  container: {
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column" as "column",
  }
});

interface Props {}

interface State {}

class DashboardTA extends React.Component<Props & EContextValue, State> {
  state = {} as {};

  render() {
    const classes = (this.props as any).classes;
    return (
      <Container
        maxWidth="lg"
        className={classes.container}
        classes={{ root: classes.root }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.fixedHeight}>
              <QualityOfServiceCard />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withUser()(DashboardTA)
);
