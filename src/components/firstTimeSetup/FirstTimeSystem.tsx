import DayjsUtils from '@date-io/dayjs';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,

  FormLabel,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import {
  KeyboardDatePicker, MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import React from "react";
import { toast } from "react-toastify";
import { CourseResponse } from '../../models/CourseResponse';
import { User } from '../../models/User';
import axios from "../../utils/axios";
import LinkifyText from "../../utils/linkify";
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
  },
  fileUpload: {
    ...theme.typography
  }
});

interface Props { }

interface State {
  activeStep: number;
  course: CourseResponse;
  dateValue: Date;
  userInfo: User | null;
}

class FirstTimeSystem extends React.Component<Props & EContextValue, State> {
  state = {
    activeStep: 0,
    zoom: "" as string,
    targetGrade: undefined as number | undefined,
    profilePicture: undefined as File | undefined,
    userInfo: this.props.user,
    course: {
      name: "",
      gitHubOrgURL: "",
      courseWebURL: "",
      startDate: new Date().toISOString().split('T')[0],
      demoModule: true,
      helpModule: true
    } as CourseResponse,
    dateValue: new Date()
  };

  private steps: string[] = ["Welcome!", "General Settings", "Modules", "User Information"];

  private async sendSetup() {
    try {
      if (!this.state.userInfo || !this.state.userInfo.id) {
        toast("Something went terribly wrong. User data is malformed", { type: "error" });
        return;
      }

      const strippedUser = {
        id: this.state.userInfo.id,
        firstName: this.state.userInfo.firstName,
        lastName: this.state.userInfo.firstName,
        email: this.state.userInfo.email
      }
      const courseProccessed: CourseResponse = {
        ...this.state.course,
        name: this.state.course.name === "" ? null : this.state.course.name,
        gitHubOrgURL: this.state.course.gitHubOrgURL === "" ? null : this.state.course.gitHubOrgURL,
        courseWebURL: this.state.course.courseWebURL === "" ? null : this.state.course.courseWebURL
      }
      const response = await axios.post(
        "/course",
        courseProccessed
      );

      const userUpdateResponse = await axios.put("/user", strippedUser);
      if (response.status === 200 && userUpdateResponse.status === 200 && this.props.user) {
        this.props.setUser({
          ...this.props.user,
          firstName: this.state.userInfo.firstName,
          lastName: this.state.userInfo.firstName,
          email: this.state.userInfo.email,
          role: "TEACHER"
        })
        this.props.setCourse(courseProccessed);
      } else {
        toast("Something went terribly wrong. I don't know why.", { type: "error" });
      }
    } catch (e) { }
  }

  private handlePrev = () => {
    if (this.state.activeStep > 0) {
      this.setState((prevState) => ({
        activeStep: prevState.activeStep - 1,
      }));
    }
  }

  private handleNext = () => {
    if (this.stepValidator()) {
      if (this.state.activeStep + 1 === this.steps.length) {
        this.sendSetup()
        return;
      }

      this.setState((prevState) => ({
        activeStep: prevState.activeStep + 1,
      }));
      return;
    }
  };

  private handleDateChange = (date: MaterialUiPickersDate) => {
    if (date && date.isValid()) {
      this.setState({
        dateValue: date.toDate(),
        course: {
          ...this.state.course,
          startDate: date.toISOString().split('T')[0]
        }
      });
    }
  }

  private modules: JSX.Element = <p></p>

  private userInfo: JSX.Element = <p></p>

  private welcomeStep: JSX.Element = (
    <div><Typography>
      Thank you for choosing Bubify! <span role="img" aria-labelledby="jsx-a11y/accessible-emoji">🦉</span>
      <br /><br />
      Please visit <LinkifyText>https://github.com/bubify/issues</LinkifyText> if you have any suggestions or find any bugs.</Typography>
    </div>
  )

  private generalSettings: JSX.Element = <div></div>;

  private getStepContent(stepIndex: number) {
    switch (stepIndex) {
      case 0:
        return this.welcomeStep;
      case 1:
        return this.generalSettings;
      case 2:
        return this.modules;
      case 3:
        return this.userInfo;
      default:
        return <CircularProgress />;
    }
  }

  private validateSettingsStep() {
    const { course } = this.state;
    if ((course.name === undefined || course.name === null || course.name.length === 0) ||
      (course.startDate === undefined || course.startDate === null)) {
      toast("Name and start date is mandatory", {
        type: "error",
      });
      return false;
    }
    return true;
  }

  private validateUserStep() {
    const { userInfo } = this.state;
    if (!userInfo) return false;
    if ((userInfo.firstName === undefined || userInfo.firstName === null || userInfo.firstName.length === 0) ||
      (userInfo.lastName === undefined || userInfo.lastName === null || userInfo.lastName.length === 0) ||
      (userInfo.email === undefined || userInfo.email === null || userInfo.email.length === 0)) {
      toast("First name, last name and email is mandatory", {
        type: "error",
      });
      return false;
    }
    return true;
  }

  private stepValidator() {
    switch (this.state.activeStep) {
      case 0:
        return true;
      case 1:
        return this.validateSettingsStep();
      case 2:
        return true;
      case 3:
        return this.validateUserStep();
      case 4:
        return true;
      default:
        return false;
    }
  }

  private onCourseChange = (event: any) => {
    switch (event.target.id) {
      case 'course-name':
        this.setState({
          course: {
            ...this.state.course,
            name: event.target.value
          }
        });
        break;
      case 'course-github':
        this.setState({
          course: {
            ...this.state.course,
            gitHubOrgURL: event.target.value
          }
        });
        break;
      case 'course-webUrl':
        this.setState({
          course: {
            ...this.state.course,
            courseWebURL: event.target.value
          }
        });
        break;
    }
  }

  private onUserInfoChange = (event: any) => {
    if (!this.state.userInfo) return;
    switch (event.target.id) {
      case 'user-firstName':
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            firstName: event.target.value as string
          }
        });
        break;
      case 'user-lastName':
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            lastName: event.target.value as string
          }
        });
        break;
      case 'user-email':
        this.setState({
          userInfo: {
            ...this.state.userInfo,
            email: event.target.value as string
          }
        });
        break;
    }
  }

  private onModuleChange = (event: any) => {
    switch (event.target.id) {
      case 'demo':
        this.setState((prevState) => ({
          course: {
            ...prevState.course,
            demoModule: !prevState.course.demoModule
          }
        }));
        break;
      case 'help':
        this.setState((prevState) => ({
          course: {
            ...prevState.course,
            helpModule: !prevState.course.helpModule
          }
        }));
        break;
    }
  }

  render() {
    this.userInfo = (
      <div>
        <TextField required id="user-firstName" label="First name" placeholder="E.g Jane" fullWidth
          value={this.state.userInfo?.firstName}
          onChange={this.onUserInfoChange} />
        <TextField required id="user-lastName" label="Last name" placeholder="E.g Doe" fullWidth
          value={this.state.userInfo?.lastName}
          onChange={this.onUserInfoChange} />
        <TextField required id="user-email" label="Email" placeholder="E.g jane.doe@mail.org" fullWidth
          value={this.state.userInfo?.email}
          onChange={this.onUserInfoChange} />
        <TextField required id="user-role" disabled label="Role" fullWidth value="TEACHER" />
        <TextField required id="user-username" disabled label="Username" fullWidth value={this.state.userInfo?.userName} />
      </div>
    )
    this.generalSettings = (
      <div>
        <TextField required id="course-name" label="Instance name" placeholder="This is typcially the name of the course" fullWidth
          value={this.state.course.name}
          onChange={this.onCourseChange} />
        <MuiPickersUtilsProvider utils={DayjsUtils}>
          <KeyboardDatePicker
            margin="normal"
            id="course-date"
            label="Course start date"
            format="YYYY-MM-DD"
            required
            value={this.state.dateValue}
            onChange={this.handleDateChange}
            fullWidth
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <TextField label="GitHub base URL" fullWidth
          id="course-github"
          placeholder="E.g. https://github.com/IOOPM-UU"
        />
        <TextField label="Course web URL" fullWidth
          id="course-webUrl"
          placeholder="E.g. https://wrigstad.com/ioopm/"
        />
      </div>
    );
    this.modules = (
      <FormControl>
        <FormLabel component="legend">Modules</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={this.state.course.helpModule as boolean} value={this.state.course.helpModule as boolean} id="help"
              onChange={this.onModuleChange} />}
            label="Help module"
          />
          <FormControlLabel
            control={<Checkbox checked={this.state.course.demoModule as boolean} value={this.state.course.demoModule as boolean} onChange={this.onModuleChange} id="demo" />}
            label="Demo module"
          />
        </FormGroup>
      </FormControl>
    );
    const classes = (this.props as any).classes;
    const { activeStep } = this.state;
    return (
      <div className={classes.root}>
        <Typography className={classes.title} variant="h2">
          System Setup
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
              onClick={this.handlePrev}
              disabled={this.state.activeStep === 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleNext}
              style={{ marginLeft: "10px" }}
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
  withUser()(FirstTimeSystem)
);
