import {
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  TextField, Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import RoomIcon from '@material-ui/icons/Room';
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import AchievementsList from "../achievementsList";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import UsersList from "../usersList";
import { getSortedUserList } from "../../utils/functions/getSortedUserList";

interface Props {
  handleDialog: () => void;
  handleRequestButton?: (b: boolean) => void;
}

interface State {
  users: User[] | undefined;
  zoomPassword: string;
  selectedUserIds: User[];
  achievementsRemaining: AchievementsResponse[] | null;
  selectedAchievements: AchievementsResponse[];
  disabledId: string | undefined;
  physicalRoom: boolean;
  room: string;
  allAchievements: boolean;
}

const ModalStyle = {
  position: "relative" as "relative",
  left: "5vw",
  top: "10vh",
  overflow: "auto"
};

const styles = (theme: Theme) => ({
  paper: {
    maxHeight: "80vh",
    width: "90vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
});

class SelectGoalsToDemonstrate extends React.Component<
  Props & WithTranslation & EContextValue,
  State
  > {
  public state = {
    users: undefined as User[] | undefined,
    zoomPassword: "" as string,
    selectedUserIds: [] as User[],
    achievementsRemaining: null as AchievementsResponse[] | null,
    selectedAchievements: [] as AchievementsResponse[],
    disabledId: this.props.user?.id,
    physicalRoom: this.props.course?.roomSetting?.localeCompare("PHYSICAL") === 0 ||
    this.props.course?.roomSetting?.localeCompare("BOTH") === 0 ? true : false,
    room: "" as string,
    allAchievements: false
  };

  private handleUserChange = (event: any, values: User[]) => {
    if (values.length > 0)
      this.setState({
        selectedUserIds: values,
      });
  };

  private onAllAchievements = (event: any) => {
    console.log(this.props.achievements)
    this.setState(prevProps => ({
      allAchievements: !prevProps.allAchievements,
    }));
  };

  private handleAchievementChange = (
    event: any,
    values: AchievementsResponse[]
  ) => {
    this.setState({
      selectedAchievements: values,
    });
  };

  private handleZoomPasswordChange = (e: any) => {
    if (e.target.value.length < 160) this.setState({ zoomPassword: e.target.value });
  };

  private handleSendRequest = async () => {
    try {
      const response = await axios.post("/demonstration/request", {
        ids: this.state.selectedUserIds.map((a) => a.id),
        achievementIds: this.state.selectedAchievements.map((a) => a.id),
        zoomPassword: this.state.zoomPassword.length > 0 && !this.state.physicalRoom ? this.state.zoomPassword : null,
        physicalRoom: this.state.physicalRoom && this.state.room.length > 0 ? this.state.room : null
      });
      if (this.props.handleRequestButton) this.props.handleRequestButton(false);

      if (response.status === 200) {
        toast(this.props.t("SelectGoalsToDemonstrate.requestSent"), {
          type: "success",
        });
      }
    } catch (e) {
      if (this.props.handleRequestButton) this.props.handleRequestButton(true);
    }
    this.props.handleDialog();
  };

  async componentDidMount() {
    try {
      const selectedUserIds: User[] = [];
      const user = this.props?.user;
      if (user) {
        selectedUserIds?.push(user);
      }
      const users: User[] = await getSortedUserList("student")
      const achievements: AxiosResponse<
        AchievementsResponse[]
      > = await axios.get("/remaining/demonstrable");
      this.setState({
        selectedUserIds,
        users: users,
        achievementsRemaining: achievements.data.filter(a => !a.currentlyPushedBack),
      });
    } catch (e) { }
  }

  private handleRoomChange = (e: any) => {
    if (e.target.value.length < 32) this.setState({ room: e.target.value });
  };

  private onRoomChange = (event: any) => {
    switch (event.target.id) {
      case 'physical':
        this.setState({
          physicalRoom: true
        });
        break;
      case 'zoom':
        this.setState({
          physicalRoom: false
        });
        break;
    }
  }

  render() {
    const loading = !this.state.achievementsRemaining;
    const roomIsFilled: boolean = this.state.physicalRoom ? this.state.room.length > 0 : true;
    const canSend: boolean =
      this.state.selectedUserIds.length > 0 &&
      this.state.selectedAchievements.length > 0 && roomIsFilled;
    const date1315 = dayjs(new Date()).set('hour', 13).set('minute', 15).set('second', 0);
    const dateIsBefore1315 = dayjs(new Date()).isBefore(date1315);
    return (
      <div style={ModalStyle} className={(this.props as any).classes.paper}>
        {loading ? (
          <p></p>
        ) : (
            <FormGroup>
              {dateIsBefore1315 ?
              <Typography style={{ marginLeft: "10px", marginTop: "10px" }} color="error">
                Warning: the queue will be cleared at the scheduled start of the lab session
              </Typography> : null}
              <AchievementsList
                limit={4}
                label={this.props.t("AchievementsRequest.selectAchievements")}
                achievementsRemaining={
                  this.state.allAchievements ? this.props.achievements : this.state.achievementsRemaining
                }
                selectedAchievements={this.state.selectedAchievements}
                handleChange={this.handleAchievementChange}
              />
              <FormControlLabel
                control={<Checkbox style={{ marginLeft: "10px" }} checked={this.state.allAchievements} value={this.state.allAchievements} onChange={this.onAllAchievements} id="allAchievements"/>}
                label="Show all achievements"/>
              <UsersList
                disabledId={this.state.disabledId}
                selectedUsers={this.state.selectedUserIds}
                users={this.state.users}
                handleChange={this.handleUserChange}
              />
              {this.props.course?.roomSetting?.localeCompare("BOTH") === 0 ?
              <Typography style={{ marginLeft: "10px" }}>
                <RoomIcon style={{verticalAlign: "-6px", marginRight: "10px", color: "#6F7D8C"}}/>
                <FormControlLabel
                control={<Checkbox checked={this.state.physicalRoom} value={this.state.physicalRoom} onChange={this.onRoomChange} id="physical"/>}
                label="Physical room"/>
                <FormControlLabel
                control={<Checkbox checked={!this.state.physicalRoom} value={!this.state.physicalRoom} onChange={this.onRoomChange} id="zoom"/>}
                label="Zoom"/>
              </Typography> : <></>}
              {this.state.physicalRoom || this.props.course?.roomSetting?.localeCompare("PHYSICAL") === 0 ?
              <div><Chip color="secondary" label="1515" onClick={() => {this.setState({room: "1515"})}} style={{marginLeft: "10px", marginTop: "10px", marginBottom: "10px"}} /><Chip color="secondary" label="1549" onClick={() => {this.setState({room: "1549"})}} style={{marginLeft: "10px", marginTop: "10px", marginBottom: "10px"}} /><Chip color="secondary" label="1245" onClick={() => {this.setState({room: "1245"})}} style={{marginLeft: "10px", marginTop: "10px", marginBottom: "10px"}} />
              <TextField
                style={{ marginLeft: "10px", marginBottom: "10px" }}
                id="SelectUsersHelpList-room"
                label="Room"
                placeholder="E.g. outside 1541"
                value={this.state.room}
                onChange={this.handleRoomChange}
                fullWidth
              /></div> : <></>}
              {!this.state.physicalRoom || this.props.course?.roomSetting?.localeCompare("ZOOM") === 0 ?
              <TextField
                style={{ marginLeft: "10px", marginBottom: "10px" }}
                id="SelectGoalsToDemonstrate-zoom-password"
                label="Zoom password (optional)"
                value={this.state.zoomPassword}
                onChange={this.handleZoomPasswordChange}
              /> : <></>}
              <SafeButton
                style={{marginTop: "10px"}}
                color="primary"
                onClick={this.handleSendRequest}
                variant="contained"
                disabled={!canSend}
              >
                {this.props.t("SelectGoalsToDemonstrate.sendRequest")}
              </SafeButton>
              {this.state.selectedAchievements.length > 4 ? (
                <Typography color="error">
                  {this.props.t("SelectGoalsToDemonstrate.warningTooManyGoals")}
                </Typography>
              ) : null}
              {this.state.selectedUserIds.length > 2 ? (
                <Typography color="error">
                  {this.props.t("SelectGoalsToDemonstrate.warningTooManyUsers")}
                </Typography>
              ) : null}
            </FormGroup>
          )}
      </div>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(withUser()(SelectGoalsToDemonstrate))
);
