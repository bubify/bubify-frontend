import { FormGroup, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import DashboardStudent from "../dashboard/DashboardStudent";
import { Loader } from "../loader/Loader";

interface Props { }

interface State {
  users: User[] | undefined;
  selectedUser: User | undefined;
  fullCurrentUser: undefined | User;
  menuValue: number;
}

class ViewStudent extends React.Component<
  Props & WithTranslation,
  State
> {
  public state = {
    users: undefined as User[] | undefined,
    selectedUser: undefined as User | undefined,
    fullCurrentUser: undefined as undefined | User,
    menuValue: 0 as number
  };

  async getUsers() {
    try {
      const response: AxiosResponse<User[]> = await axios.get(
        "/allStudentNamesAndIds"
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

  render() {
    const loading = this.state.users === undefined || this.state.selectedUser === undefined;

    return (
      <div>
        {loading ? (
          <>{!this.state.users ? <Loader /> : <Typography>No students are enrolled in the current course instance, or no current course instance exists.</Typography>}</>
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
              {this.state.fullCurrentUser ? <DashboardStudent customUser={this.state.fullCurrentUser} refreshUser={this.getUser.bind(this)} /> : null}
            </FormGroup>
          </>
        )
        }
      </div>
    );
  }
}

export default withTranslation()(ViewStudent);
