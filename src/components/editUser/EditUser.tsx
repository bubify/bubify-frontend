import { Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { Loader } from "../loader/Loader";
import ProfilePicture from "../profilePicture";
import { SafeButton } from "../safeButton/SafeButton";

interface Props { }

interface State {
  users: User[] | undefined;
  selectedUser: User | undefined;
  fullCurrentUser: undefined | User;
}

class EditUser extends React.Component<
  Props & WithTranslation,
  State
> {
  public state = {
    users: undefined as User[] | undefined,
    selectedUser: undefined as User | undefined,
    fullCurrentUser: undefined as undefined | User,
  };

  async getUsers() {
    try {
      const response: AxiosResponse<User[]> = await axios.get(
        "/allNamesAndIds"
      );
      this.setState({ users: response.data });
    } catch (e) { }
  }

  async componentDidMount() {
    await this.getUsers();
    if (this.state?.users) this.handleChange(undefined, this.state.users[0])
  }

  private getUser = async () => {
    try {
      if (!this.state.selectedUser) {
        this.setState({ fullCurrentUser: undefined })
        throw new Error("Invalid state");
      }
      const response: AxiosResponse<User> = await axios.get(
        "/users/" + this.state.selectedUser.id
      );
      this.setState({ fullCurrentUser: response.data })
    } catch (e) { }
  }

  private handleChange = (event: any, value: User) => {
    this.setState({
      selectedUser: value,
    }, this.getUser);
  };

  private handleRole = (event: any) => {
    if (this.state.fullCurrentUser === undefined) {
      return;
    }
    const u: User = { ...this.state.fullCurrentUser }
    u.role = event.target.value;
    this.setState({
      fullCurrentUser: u
    });
  }

  private handleEditUserChange = (event: any) => {
    if (this.state.fullCurrentUser === undefined) {
      return;
    }
    const u: User = { ...this.state.fullCurrentUser }
    switch (event.target.id) {
      case "firstName":
        u.firstName = event.target.value
        break;
      case "lastName":
        u.lastName = event.target.value
        break;
      case "zoomRoom":
        u.zoomRoom = event.target.value
        break;
      case "verifiedProfilePic":
        u.verifiedProfilePic = event.target.checked
        break;
      case "email":
        u.email = event.target.value
        break;
      case "gitHubHandle":
        u.gitHubHandle = event.target.value
        break;
      case "userName":
        u.userName = event.target.value
        break;
      case "handleHelpRequests":
        u.canClaimHelpRequests = event.target.checked
        break;
    }
    this.setState({ fullCurrentUser: u })
  }

  private handleUpdateUser = async () => {
    try {
      if (!this.state.selectedUser ||
        this.state.fullCurrentUser === undefined) {
        throw new Error("Invalid state");
      }
      const strippedUser = {
        id: this.state.fullCurrentUser.id,
        firstName: this.state.fullCurrentUser.firstName,
        lastName: this.state.fullCurrentUser.lastName,
        zoomRoom: this.state.fullCurrentUser.zoomRoom,
        verifiedProfilePic: this.state.fullCurrentUser.verifiedProfilePic,
        email: this.state.fullCurrentUser.email,
        gitHubHandle: this.state.fullCurrentUser.gitHubHandle,
        userName: this.state.fullCurrentUser.userName,
        role: this.state.fullCurrentUser.role,
        canClaimHelpRequests: this.state.fullCurrentUser.canClaimHelpRequests
      }
      const response = await axios.put("/user", strippedUser)
      if (response.status === 200) {
        toast("Updated user", { type: "success" })
        await this.getUsers();
      }
    } catch (e) { }
  }

  render() {
    const loading = this.state.users === undefined || this.state.selectedUser === undefined;
    const canSend: boolean = this.state.selectedUser !== undefined;

    const editUser = (<>
      {this.state.fullCurrentUser ?
        <>
          {this.state.fullCurrentUser.needsProfilePic ? <p style={{ margin: "10px" }}>No profile picture uploaded</p> :
            <div style={{ width: "400px" }}>
              <ProfilePicture disableInitials customUser={this.state.selectedUser} />
            </div>}

          <TextField
            style={{ margin: "10px" }}
            id="firstName"
            label="First name"
            value={this.state.fullCurrentUser.firstName}
            onChange={this.handleEditUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="lastName"
            label="Last name"
            value={this.state.fullCurrentUser.lastName}
            onChange={this.handleEditUserChange}
          />
          <FormControl style={{ margin: "10px" }}>
            <InputLabel id="role">Role</InputLabel>
            <Select
              value={this.state.fullCurrentUser.role}
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
            value={this.state.fullCurrentUser.userName}
            onChange={this.handleEditUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="email"
            label="Email"
            value={this.state.fullCurrentUser.email}
            onChange={this.handleEditUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="zoomRoom"
            label="Zoom ID"
            value={this.state.fullCurrentUser.zoomRoom ? this.state.fullCurrentUser.zoomRoom : ""}
            onChange={this.handleEditUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="gitHubHandle"
            label="GitHub handle"
            value={this.state.fullCurrentUser.gitHubHandle ? this.state.fullCurrentUser.gitHubHandle : ""}
            onChange={this.handleEditUserChange}
          />
          <TextField
            style={{ margin: "10px" }}
            id="lastLogin"
            label="Last login"
            disabled
            value={this.state.fullCurrentUser.lastLogin ? new Date(this.state.fullCurrentUser.lastLogin).toLocaleString() : "Never"}
            onChange={this.handleEditUserChange}
          />
          <FormControlLabel
            style={{ marginLeft: "5px" }}
            control={
              <Checkbox
                checked={this.state.fullCurrentUser.verifiedProfilePic}
                id="verifiedProfilePic"
                onChange={this.handleEditUserChange}
              />}
            label="Verified profile picture"
          />
          {this.state.fullCurrentUser.role.toUpperCase() === "STUDENT" ? <FormControlLabel
            style={{ marginLeft: "5px" }}
            control={
              <Checkbox
                checked={this.state.fullCurrentUser.canClaimHelpRequests}
                id="handleHelpRequests"
                onChange={this.handleEditUserChange}
              />}
            label="Can handle help requests"
          /> : null }
        </> : null
      }
      <SafeButton
        style={{ margin: "10px" }}
        color="primary"
        onClick={this.handleUpdateUser}
        variant="contained"
        disabled={!canSend}
      >
        Update user
    </SafeButton>
    </>)

    return (
      <div>
        {loading ? (
          <Loader />
        ) : (
          <>
            <FormGroup>
              <Autocomplete
                value={this.state.selectedUser}
                style={{ margin: "10px" }}
                disableClearable={true}
                id="tags-standard"
                onChange={this.handleChange}
                options={this.state.users as User[]}
                autoHighlight
                getOptionSelected={(option, value) => {
                  return option.id.toString() === value.id.toString();
                }}
                getOptionLabel={(user) => user.firstName + " " + user.lastName}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Select user"
                  />
                )}
              />
              {editUser}
            </FormGroup>
          </>
        )
        }
      </div>
    );
  }
}

export default withTranslation()(EditUser);
