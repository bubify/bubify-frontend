import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,

  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import React from "react";
import { toast } from "react-toastify";
import axios from "../../utils/axios";
import ProfilePictureUpload from "../profilePictureUpload";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

const styles = (theme: Theme) => ({
  root: {
    margin: "auto",
    width: "80vw",
  },
  title: {
    textAlign: "center" as "center",
  },
  nextButton: {

  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
});

interface Props { }

interface State {
  activeStep: number;
  nextEnabled: boolean
}

class FirstTimeSetupTeacher extends React.Component<Props & EContextValue, State> {
  state = {
    activeStep: 0,
    nextEnabled: false as boolean
  };

  private steps: string[] = ["Upload Profile Picture"];

  private async sendSetup() {
    const response = await axios.get("/users/" + this.props?.user?.id);
    if (response.status === 200) {
      if (response.data.length === 0) { toast("Error"); return; }
      this.props.setUser(response.data);
    }
  }

  private handleNext = async () => {
    if (this.stepValidator()) {
      if (this.state.activeStep + 1 === 1) {
        this.sendSetup()
        return;
      }

      this.setState((prevState) => ({
        activeStep: prevState.activeStep + 1,
      }));
      return;
    }
  };

  private enableNext = () => {
    this.setState({ nextEnabled: true });
  }

  private uploadProfilePic: JSX.Element = <ProfilePictureUpload enableNext={this.enableNext.bind(this)} />

  private getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return this.uploadProfilePic;
      default:
        return <CircularProgress />;
    }
  }

  private stepValidator() {
    switch (this.state.activeStep) {
      case 0:
        return true;
      default:
        return false;
    }
  }

  render() {
    const classes = (this.props as any).classes;
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <Typography className={classes.title} variant="h2">
        Profile Data Required
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {this.steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div>
          <div className={classes.instructions}>
            {this.getStepContent(activeStep)}
          </div>

          <div className={classes.nextButton}>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              disabled={!this.state.nextEnabled}
            >
              {activeStep === this.steps.length - 1 ? "Finish" : "Next"}
            </Button>
            <Button style={{ float: "right" }} onClick={() => this.props.clearStorage()}>Logout</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withUser()(FirstTimeSetupTeacher)
);
