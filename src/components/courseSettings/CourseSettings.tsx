import DayjsUtils from "@date-io/dayjs";
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Select, Switch, TextField } from "@material-ui/core";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import React from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CourseResponse } from "../../models/CourseResponse";
import axios from "../../utils/axios";
import { Loader } from "../loader/Loader";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";

interface Props { }

interface State {
  course: CourseResponse;
}

class CourseSettings extends React.Component<
  any,
  State
> {
  constructor(props: any) {
    super(props)
    this.state = {
      course: JSON.parse(JSON.stringify(this.props.course)) // Ugly deep copy
    }
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.course == null && this.props.course != null) {
      this.setState({
        course: JSON.parse(JSON.stringify(this.props.course))
      })
    }
  }

  private onModuleChange = (event: any) => {
    switch (event.target.id) {
      case 'profilePictures':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              profilePictures: !prevState.course.profilePictures
            }
          })
        });
        break;
      case 'burndownModule':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              burndownModule: !prevState.course.burndownModule
            }
          })
        });
        break;
      case 'statisticsModule':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              statisticsModule: !prevState.course.statisticsModule
            }
          })
        });
        break;
      case 'cron':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              clearQueuesUsingCron: !prevState.course.clearQueuesUsingCron
            }
          })
        });
        break;
      case 'demo':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              demoModule: !prevState.course.demoModule
            }
          })
        });
        break;
      case 'intro':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              onlyIntroductionTasks: !prevState.course.onlyIntroductionTasks
            }
          })
        });
        break;
      case 'help':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              helpModule: !prevState.course.helpModule
            }
          })
        });
        break;
      case 'exam':
        this.setState((prevState) => {
          return ({
            course: {
              ...prevState.course,
              examMode: !prevState.course.examMode
            }
          })
        });
        break;
    }
  }

  private handleCourseChange = (event: any) => {
    const c: CourseResponse = { ...this.state.course }
    switch (event.target.id) {
      case "course-name":
        c.name = event.target.value
        break;
      case "course-github":
        c.gitHubOrgURL = event.target.value
        break;
      case "course-webUrl":
        c.courseWebURL = event.target.value
        break;
    }
    this.setState({ course: c })
  }

  private handleRoomChange = (event: any) => {
    const c: CourseResponse = { ...this.state.course }
    c.roomSetting = event.target.value;
    this.setState({ course: c })
  }

  private handleUpdateCourse = async () => {
    const response = await axios.put("/course", this.state.course)
    if (response.data === "SUCCESS") {
      toast("Updated course", { type: "success" })
    }
  }

  private handleDateChange = (date: MaterialUiPickersDate) => {
    if (date && date.isValid()) {
      this.setState((prevState) => {
        const c: CourseResponse = { ...prevState.course };
        c.startDate = date.format('YYYY-MM-DD').toString()
        return { course: c };
      });
    }
  }

  render() {
    const course = this.state.course;
    const canSend: boolean = (course !== null && course.name !== null && course.name !== undefined && course.name.length > 0);

    if (!this.state.course) {
      return <Loader />
    }

    return (
      <div>
        <FormGroup>
          <TextField required id="course-name" label="Instance name" placeholder="This is typcially the name of the course" fullWidth style={{ margin: "10px" }}
            value={this.state.course.name}
            onChange={this.handleCourseChange} />
          <MuiPickersUtilsProvider utils={DayjsUtils}>
            <KeyboardDatePicker
              style={{ margin: "10px" }}
              margin="normal"
              id="course-date"
              label="Course start date"
              format="YYYY-MM-DD"
              required
              value={this.state.course.startDate}
              onChange={this.handleDateChange.bind(this)}
              fullWidth
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </MuiPickersUtilsProvider>
          <TextField label="GitHub base URL" fullWidth
            value={this.state.course.gitHubOrgURL}
            onChange={this.handleCourseChange}
            disabled
            id="course-github" style={{ margin: "10px" }}
            placeholder="E.g. https://github.com/IOOPM-UU"
          />
          <TextField label="Course web URL" fullWidth
            value={this.state.course.courseWebURL}
            onChange={this.handleCourseChange}
            disabled
            id="course-webUrl" style={{ margin: "10px" }}
            placeholder="E.g. https://wrigstad.com/ioopm/"
          />
          <FormControl>
            <InputLabel shrink style={{ marginLeft: "10px" }}>
            Room mode
            </InputLabel>
            <Select
            id="room-mode"
            onChange={this.handleRoomChange}
            style={{ margin: "10px", marginTop: "15px" }}
            value={this.state.course.roomSetting}
            >
              <MenuItem value={"BOTH"}>Both Zoom and physical rooms</MenuItem>
              <MenuItem value={"PHYSICAL"}>Physical rooms only</MenuItem>
              <MenuItem value={"ZOOM"}>Zoom only</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel style={{ margin: "10px" }} component="legend">Automation</FormLabel>
            <FormControlLabel
                style={{ marginLeft: "10px"}}
                control={<Checkbox checked={this.state.course.clearQueuesUsingCron as boolean} value={this.state.course.helpModule as boolean} id="cron"
                onChange={this.onModuleChange}/>}
                label="Clear queues every day at 13:14:50"
              />
          </FormControl>
          <FormControl>
            <FormLabel style={{ margin: "10px" }} component="legend">Modules</FormLabel>
            <FormGroup>
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.profilePictures as boolean} value={this.state.course.profilePictures as boolean} id="profilePictures"
                  onChange={this.onModuleChange} />}
                label="Profile pictures"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.burndownModule as boolean} value={this.state.course.burndownModule as boolean} id="burndownModule"
                  onChange={this.onModuleChange} />}
                label="Burndown chart module"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.statisticsModule as boolean} value={this.state.course.statisticsModule as boolean} id="statisticsModule"
                  onChange={this.onModuleChange} />}
                label="Statistics module (student)"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.helpModule as boolean} value={this.state.course.helpModule as boolean} id="help"
                  onChange={this.onModuleChange}
                  disabled={this.state.course.examMode as boolean} />}
                label="Help module"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.onlyIntroductionTasks as boolean} value={this.state.course.onlyIntroductionTasks as boolean} id="intro"
                  onChange={this.onModuleChange} disabled={this.state.course.examMode as boolean}/>}
                label="Only show introduction tasks"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Checkbox checked={this.state.course.demoModule as boolean} value={this.state.course.demoModule as boolean} onChange={this.onModuleChange} id="demo"
                disabled={this.state.course.examMode as boolean}/>}
                label="Demo module"
              />
              <FormControlLabel
                style={{ marginLeft: "10px" }}
                control={<Switch
                  checked={this.state.course.examMode as boolean}
                  id="exam"
                  onChange={this.onModuleChange}
                />}
                label="Exam mode"
              />
            </FormGroup>
          </FormControl>
          <SafeButton
            style={{ margin: "10px" }}
            color="primary"
            onClick={this.handleUpdateCourse}
            variant="contained"
            disabled={!canSend}
          >
            Update instance settings
          </SafeButton>
        </FormGroup>
      </div>
    );
  }
}

export default withTranslation()(withUser()(CourseSettings));
