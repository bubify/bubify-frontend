import { FormGroup } from "@material-ui/core";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { fullName } from "../../utils/fullName";
import { SafeButton } from "../safeButton/SafeButton";
import UsersList from "../usersList";

interface Props { }

interface State {
  users: User[] | undefined;
  selectedUsers: User[];
}

class RevokeProfilePicture extends React.Component<
  Props & WithTranslation,
  State
  > {
  public state = {
    users: undefined as User[] | undefined,
    selectedUsers: [] as User[],
  };

  async componentDidMount() {
    try {
      const response: AxiosResponse<User[]> = await axios.get(
        "/allNamesAndIds"
      );
      this.setState({ users: response.data });
    } catch (e) { }
  }

  private handleChange = (event: any, values: User[]) => {
    if (values.length < 2) {
      this.setState({
        selectedUsers: values,
      });
    }
  };

  private handleRevokeRequest = async () => {
    try {
      const response = await axios.delete("/user/revoke-profile-pic/" + this.state.selectedUsers[0].id) // Can only select one user in MVP
      if (response.status === 200) {
        toast("Revoked " + fullName(this.state.selectedUsers[0]) + "'s profile picture", { type: "success" })
      }
    } catch (e) { }
  }

  render() {
    const loading = !this.state.users;
    const canSend: boolean = this.state.selectedUsers.length > 0;
    return (
      <div>
        {loading ? (
          <p></p>
        ) : (
            <>
              <FormGroup>
                <UsersList
                  selectedUsers={this.state.selectedUsers}
                  users={this.state.users}
                  handleChange={this.handleChange}
                />
                <SafeButton
                  style={{ margin: "10px" }}
                  color="primary"
                  onClick={this.handleRevokeRequest}
                  variant="contained"
                  disabled={!canSend}
                >
                  Revoke user's profile picture
          </SafeButton>
              </FormGroup>
            </>
          )
        }
      </div>
    );
  }
}

export default withTranslation()(RevokeProfilePicture);
