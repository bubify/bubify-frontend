import {
  Button,
  CircularProgress,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { isNumeric } from "../../utils/functions/isNumeric";
import { defaultWeeksTarget } from "../burnDownChart/BurnDownChart";
import { Loader } from "../loader/Loader";
import ProfilePictureUpload from "../profilePictureUpload";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
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
  },
  fileUpload: {
    ...theme.typography
  }
});

interface Props { }

interface State {
  activeStep: number;
  zoom: string;
  nextEnabled: boolean;
}

class FirstTimeStudent extends React.Component<Props & EContextValue, State> {
  state = {
    activeStep: this.props.user?.profilePic ? 1 : 0,
    zoom: "" as string,
    nextEnabled: false as boolean,
  };

  private steps: string[] = ["Upload Profile Picture", "Zoom Link"];

  componentDidMount() {
    if (this.props.user !== null && this.props.course !== null) {
      if (!this.props.user.needsProfilePic || this.props.course?.profilePictures === false || !this.props.course?.profilePictures) {
        this.setState({ activeStep: 1, nextEnabled: true })
      }
    }
  }

  componentDidUpdate(prevProps: Props & EContextValue) {
    // If component was loaded before course or user was installed
    if ((this.props.user !== null && this.props.course !== null) &&
        (this.props.course !== prevProps.course || this.props.user !== prevProps.user)) {
      if (!this.props?.user?.needsProfilePic || this.props.course?.profilePictures === false || !this.props.course?.profilePictures) {
        this.setState({ activeStep: 1, nextEnabled: true })
      }
    }
  }

  componentWillUnmount() {
    SubscriptionContext.getInstance().unregister();
  }

  private async sendSetup() {
    let defaultDeadline = null;
    if (this.props.course?.startDate && this.props.user?.deadline === null) {
      defaultDeadline = this.props.course?.startDate ? dayjs(new Date(this.props.course?.startDate)) : null;
      defaultDeadline = defaultDeadline?.add(defaultWeeksTarget, 'week');
    }

    if (!this.state.zoom !== undefined) {
      await axios.put<User>("/user", {
        id: this.props.user?.id,
        zoomRoom: this.state.zoom,
        deadline: defaultDeadline?.format('YYYY-MM-DD').toString(),
        verifiedProfilePic: this.props.user?.verifiedProfilePic,
        canClaimHelpRequests: this.props.user?.canClaimHelpRequests
      });
    }

    const response = await axios.get("/users/" + this.props?.user?.id);
    if (response.status === 200) {
      if (response.data.length === 0) { toast("Error"); return; }
      this.props.setUser(response.data);
    }
  }

  private handleNext = async () => {
    if (this.stepValidator()) {
      if (this.state.activeStep + 1 === 2) {
        this.sendSetup()
        return;
      }

      this.setState((prevState) => ({
        activeStep: prevState.activeStep + 1,
      }));
      return;
    }
  };

  private handleZoomInput(event: any) {
    const zoom = event.target.value;
    if (!isNumeric(zoom) || zoom.length > 10) return;
    this.setState({ zoom });
  }

  private enableNextAndStep = () => {
    this.setState(prevProps => ({ nextEnabled: true, activeStep: prevProps.activeStep + 1 }));
  }

  private zoomLink: JSX.Element = <></>;

  private uploadProfilePic: JSX.Element = <ProfilePictureUpload enableNext={this.enableNextAndStep.bind(this)} />

  private getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return this.uploadProfilePic;
      case 1:
        return this.zoomLink;
      default:
        return <CircularProgress />;
    }
  }

  private validateZoomStep() {
    if (this.state.zoom.length === 0) {
      toast("Providing a link to your Zoom room is mandatory for this course", {
        type: "error",
      });
      return false;
    }

    if (isNumeric(this.state.zoom) && this.state.zoom.length === 10) {
      return true;
    }

    toast("Personal Zoom meeting ID is badly formatted, please check for any error", {
      type: "error",
    });
    return false;
  }

  private stepValidator() {
    switch (this.state.activeStep) {
      case 0:
        return true;
      case 1:
        return this.validateZoomStep();
      default:
        return false;
    }
  }

  render() {
    const isLoading = this.props.course === null || this.props.user === null;

    this.zoomLink = (
      <div>
        <Typography>
          Please enter your personal ID meeting room link (e.g.
          5093129180)
        </Typography>
        <TextField
          required
          helperText="Enter Zoom link here"
          variant="outlined"
          error={false}
          value={this.state.zoom}
          onChange={this.handleZoomInput.bind(this)}
        />
      </div>
    );
    const classes = (this.props as any).classes;
    const { activeStep } = this.state;
    return (
      <>
      {isLoading ? <><Loader /></> :
      <><div className={classes.root}>
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
      </div></>}</>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withUser()(FirstTimeStudent)
);
