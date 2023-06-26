import { Checkbox, Chip, FormControlLabel, FormGroup, Theme, Typography, withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import RoomIcon from '@material-ui/icons/Room';
import dayjs from "dayjs";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import UsersList from "../usersList/UsersList";
import { getSortedUserList } from "../../utils/functions/getSortedUserList";

interface Props {
  handleDialog: () => void;
  handleRequestButton: (b: boolean) => void;
}

interface State {
  users: User[];
  selectedUserIds: User[];
  comment: string;
  zoomPassword: string;
  disabledId: string | undefined;
  physicalRoom: boolean;
  room: string;
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

class SelectUsersHelpList extends React.Component<
  Props & WithTranslation & EContextValue,
  State
  > {
  public state = {
    users: [] as User[],
    selectedUserIds: [] as User[],
    comment: "" as string,
    zoomPassword: "" as string,
    canSend: false,
    disabledId: this.props.user?.id,
    physicalRoom: this.props.course?.roomSetting?.localeCompare("PHYSICAL") === 0 ||
                  this.props.course?.roomSetting?.localeCompare("BOTH") === 0 ? true : false,
    room: "" as string
  };

  componentDidUpdate(prevProps: Props & EContextValue) {
    if (prevProps.course?.roomSetting && this.props.course?.roomSetting?.localeCompare(prevProps.course?.roomSetting) !== 0) {
      this.setState({
        physicalRoom: this.props.course?.roomSetting?.localeCompare("PHYSICAL") === 0 ||
        this.props.course?.roomSetting?.localeCompare("BOTH") === 0 ? true : false
      })
    }
  }

  private handleChange = (event: any, values: User[]) => {
    if (values.length > 0)
      this.setState({
        selectedUserIds: values,
      });
  };

  private handleSendRequest = async () => {
    try {
      const response = await axios.post("/askForHelp", {
        ids: this.state.selectedUserIds.map((u) => u.id),
        message: this.state.comment === "" ? null : this.state.comment,
        zoomPassword: this.state.zoomPassword.length > 0 && !this.state.physicalRoom ? this.state.zoomPassword : null,
        physicalRoom: this.state.physicalRoom && this.state.room.length > 0 ? this.state.room : null
      });
      this.props.handleRequestButton(false);
      this.props.handleDialog();
      if (response.status === 200) {
        toast(this.props.t("SelectUsersHelpList.toastHelpRequestAdded"), {
          type: "success",
        });
      }
    } catch (e) {
      this.props.handleRequestButton(true);
    }
  };

  private handleCommentChange = (e: any) => {
    if (e.target.value.length < 160) this.setState({ comment: e.target.value });
  };

  private handleZoomPasswordChange = (e: any) => {
    if (e.target.value.length < 160) this.setState({ zoomPassword: e.target.value });
  };

  private handleRoomChange = (e: any) => {
    if (e.target.value.length < 32) this.setState({ room: e.target.value });
  };

  async componentDidMount() {
    try {
      const selectedUsers: User[] = [];
      const user = this.props?.user;
      if (user) {
        selectedUsers?.push(user);
      }
      this.setState({ selectedUserIds: selectedUsers });

      const users: User[] = await getSortedUserList("student")
      this.setState({ users: users });
    } catch (e) { }
  }

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
    const roomIsFilled: boolean = this.state.physicalRoom ? this.state.room.length > 0 : true;
    const canSend: boolean = this.state.selectedUserIds.length > 0 && roomIsFilled;
    const date1315 = dayjs(new Date()).set('hour', 13).set('minute', 15).set('second', 0);
    const dateIsBefore1315 = dayjs(new Date()).isBefore(date1315);
    return (
      <div style={ModalStyle} className={(this.props as any).classes.paper}>
        <FormGroup>
        {dateIsBefore1315 ?
              <Typography style={{ marginLeft: "10px", marginTop: "10px" }} color="error">
                Warning: the queue will be cleared at the scheduled start of the lab session
              </Typography> : null}
          <UsersList
            disabledId={this.state.disabledId}
            selectedUsers={this.state.selectedUserIds}
            users={this.state.users}
            handleChange={this.handleChange}
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
            style={{ marginLeft: "10px" }}
            id="SelectUsersHelpList-room"
            label="Room"
            placeholder="E.g. outside 1541"
            value={this.state.room}
            fullWidth
            onChange={this.handleRoomChange}
          /></div> : <></>}
          {!this.state.physicalRoom || this.props.course?.roomSetting?.localeCompare("ZOOM") === 0 ?
          <TextField
            style={{ marginLeft: "10px" }}
            id="SelectUsersHelpList-zoom-password"
            label="Zoom password (optional)"
            value={this.state.zoomPassword}
            onChange={this.handleZoomPasswordChange}
          /> : <></>}
          <TextField
            style={{ margin: "10px" }}
            id="SelectUsersHelpList-comment"
            label={this.props.t("SelectUsersHelpList.message")}
            value={this.state.comment}
            onChange={this.handleCommentChange}
          />
          <SafeButton
            style={{ margin: "10px" }}
            color="primary"
            onClick={this.handleSendRequest}
            variant="contained"
            disabled={!canSend}
          >
            {this.props.t("SelectUsersHelpList.sendRequest")}
          </SafeButton>
        </FormGroup>
      </div>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(withUser()(SelectUsersHelpList))
);
