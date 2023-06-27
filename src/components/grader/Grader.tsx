import {
  Button,
  FormGroup,
  Typography
} from "@material-ui/core";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import AchievementsList from "../achievementsList";
import { Loader } from "../loader/Loader";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import UsersList from "../usersList";
import { getSortedUserList } from "../../utils/functions/getSortedUserList";

interface Props {

}

interface State {
  users: User[] | undefined;
  selectedUserIds: User[];
  achievements: AchievementsResponse[] | undefined;
  selectedAchievements: AchievementsResponse[];
}

class Grader extends React.Component<
  Props & WithTranslation & EContextValue,
  State
  > {
  public state = {
    users: undefined as User[] | undefined,
    selectedUserIds: [] as User[],
    achievements: undefined as AchievementsResponse[] | undefined,
    selectedAchievements: [] as AchievementsResponse[]
  };

  private handleUserChange = (event: any, values: User[]) => {
    this.setState({
      selectedUserIds: values,
    });
  };

  private handleAchievementChange = (
    event: any,
    values: AchievementsResponse[]
  ) => {
    this.setState({
      selectedAchievements: values,
    });
  };

  private handleSendRequest = async () => {
    try {
      const response = await axios.post("/grade/group_users", {
        userIds: this.state.selectedUserIds.map((a) => a.id),
        achievements: this.state.selectedAchievements.map((a) => a.code),
      });

      if (response.data === "SUCCESS") {
        toast(this.props.t("Grader.requestSent"), {
          type: "success",
        });
        this.setState({
          selectedUserIds: [],
          selectedAchievements: []
        });
      }
    } catch (e) {
    }
  };

  async componentDidMount() {
    try {
      const users: User[] = await getSortedUserList("student")

      const achievements: AxiosResponse<
        AchievementsResponse[]
      > = await axios.get("/achievements");

      this.setState({
        users: users,
        achievements: achievements.data,
      });
    } catch (e) { }
  }

  private async handleUploadResults(event: any) {
    const data = new FormData();
    data.append("file", event.target.files[0]);
    const response = await axios.post("/import/partial", data);
    if (response.status === 200) toast("Uploaded and parsed JSON", {
      type: "success",
    });
  }

  render() {
    const loading = !this.state.achievements || !this.state.users;
    const canSend: boolean =
      this.state.selectedUserIds.length > 0 &&
      this.state.selectedAchievements.length > 0;

    return (<>
      <div >
      <Typography variant="h6">Group grader</Typography>
        {loading ? (
          <Loader />
        ) : (
            <FormGroup>
              <AchievementsList
                label={this.props.t("Grader.selectAchievements")}
                achievementsRemaining={
                  this.state.achievements as AchievementsResponse[]
                }
                selectedAchievements={this.state.selectedAchievements}
                handleChange={this.handleAchievementChange}
              />
              <UsersList
                selectedUsers={this.state.selectedUserIds}
                users={this.state.users}
                handleChange={this.handleUserChange}
                label={this.props.t("Grader.selectUsers")}
                clearable={true}
              />
              <SafeButton
                color="primary"
                onClick={this.handleSendRequest}
                variant="contained"
                disabled={!canSend}
              >
                {this.props.t("Grader.sendRequest")}
              </SafeButton>
            </FormGroup>
          )}
      </div>
      <div style={{marginTop: "10px"}}>
        <Typography variant="h6">Export/import data</Typography>
        <Button onClick={async () => {
        const r = await axios.get("/report/finished", {responseType: 'blob'});
        var url = window.URL.createObjectURL(r.data)
        var a = document.createElement('a')
        a.href = url
        a.download = this.props.course?.name + "_grades_" + dayjs(new Date()).format('YYYY-MM-DD').toString()
        a.click()
        a.remove()
        setTimeout(() => window.URL.revokeObjectURL(url), 100)

      }}>Generate PDF of grades</Button>
      <Button onClick={async () => {
        const r = await axios.get("/report/partial/hp/pdf", {responseType: 'blob'});
        var url = window.URL.createObjectURL(r.data)
        var a = document.createElement('a')
        a.href = url
        a.download = this.props.course?.name + "_hp_credits_" + dayjs(new Date()).format('YYYY-MM-DD').toString()
        a.click()
        a.remove()
        setTimeout(() => window.URL.revokeObjectURL(url), 100)

      }}>Generate PDF of partial HP credits</Button>
      <Button onClick={async () => {
        const r = await axios.get("/report/partial", {responseType: 'blob'});
        var url = window.URL.createObjectURL(r.data)
        var a = document.createElement('a')
        a.href = url
        a.download = this.props.course?.name + "_partial_results_" + dayjs(new Date()).format('YYYY-MM-DD').toString()+".json"
        a.click()
        a.remove()
        setTimeout(() => window.URL.revokeObjectURL(url), 100)

      }}>Export partial results as JSON</Button>

      <input
        accept=".json"
        style={{ display: 'none' }}
        id="button-file"
        type="file"
        onChange={this.handleUploadResults.bind(this)}
      />
      <label htmlFor="button-file">
        <Button component="span">
          Import results
        </Button>
      </label>
      </div></>
    );
  }
}

export default withTranslation()(withUser()(Grader));
