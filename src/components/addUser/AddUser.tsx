import { FormControl, FormGroup, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { SafeButton } from "../safeButton/SafeButton";

interface Props { }

interface State {
  user: User;
}

class AddUser extends React.Component<
  Props & WithTranslation,
  State
> {
  private emptyUser = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    role: "STUDENT"
  } as User
  public state = {
    user: this.emptyUser
  };

  private handleRole = (event: any) => {
    const user: User = { ...this.state.user }
    user.role = event.target.value;
    this.setState({
      user
    });
  }

  private handleAddUserChange = (event: any) => {
    if (this.state.user === undefined) {
      return;
    }
    const u: User = { ...this.state.user }
    switch (event.target.id) {
      case "firstName":
        u.firstName = event.target.value
        break;
      case "lastName":
        u.lastName = event.target.value
        break;
      case "zoomRoom":
        u.zoomRoom = event.target.value.length > 0 ? event.target.value : null
        break;
      case "verifiedProfilePic":
        u.verifiedProfilePic = event.target.checked
        break;
      case "email":
        u.email = event.target.value
        break;
      case "gitHubHandle":
        u.gitHubHandle = event.target.value.length > 0 ? event.target.value : null
        break;
      case "userName":
        u.userName = event.target.value
        break;
    }
    this.setState({ user: u })
  }

  private handleUpdateUser = async () => {
    const strippedUser = {
      firstName: this.state.user.firstName,
      lastName: this.state.user.lastName,
      email: this.state.user.email,
      userName: this.state.user.userName,
      role: this.state.user.role
    }
    const response = await axios.post("/users", strippedUser)
    if (response.data === "SUCCESS") {
      toast("Added user", { type: "success" })
      this.setState({ user: this.emptyUser })
    } else {
      toast("Badly formatted user", { type: "error" })
    }
  }

  render() {
    const canSend: boolean = this.state.user.firstName.length > 0 &&
      this.state.user.lastName.length > 0 &&
      this.state.user.email.length > 0 &&
      this.state.user.userName.length > 0;

    return (
      <div>
        <FormGroup>
          <TextField
            style={{ margin: "10px" }}
            id="firstName"
            label="First name"
            value={this.state.user.firstName}
            onChange={this.handleAddUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="lastName"
            label="Last name"
            value={this.state.user.lastName}
            onChange={this.handleAddUserChange}
          />
          <FormControl style={{ margin: "10px" }}>
            <InputLabel id="role">Role</InputLabel>
            <Select
              value={this.state.user.role}
              onChange={this.handleRole}
            >
              <MenuItem value={"STUDENT"}>STUDENT</MenuItem>
              <MenuItem value={"JUNIOR_TA"}>JUNIOR_TA</MenuItem>
              <MenuItem value={"SENIOR_TA"}>SENIOR_TA</MenuItem>
              <MenuItem value={"TEACHER"}>TEACHER</MenuItem>
            </Select>
          </FormControl>
          <TextField
            style={{ margin: "10px" }}
            id="userName"
            label="Username"
            value={this.state.user.userName}
            onChange={this.handleAddUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="email"
            label="Email"
            value={this.state.user.email}
            onChange={this.handleAddUserChange}
          />
          <SafeButton
            style={{ margin: "10px" }}
            color="primary"
            onClick={this.handleUpdateUser}
            variant="contained"
            disabled={!canSend}
          >
            {this.props.t("AddUser.createUser")}
          </SafeButton>
        </FormGroup>
      </div>
    );
  }
}

export default withTranslation()(AddUser);
