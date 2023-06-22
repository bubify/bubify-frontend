import { Button, Theme, Typography, withStyles } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { isNumeric } from "../../utils/functions/isNumeric";
import { Loader } from "../loader/Loader";
import ProfilePicture from "../profilePicture";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";


interface Props {
  closeModal: () => void;
}

interface State {
  user: User | undefined;
}

const FormStyle = {
  marginTop: "10px",
  marginBottom: "10px"
};

const ModalStyle = {
  position: "relative" as "relative",
  left: "5vw",
  top: "10vh",
  overflow: "auto"
};

const styles = (theme: Theme) => ({
  paper: {
    maxHeight: "87vh",
    width: "90vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  greenText: {
    color: "#006400"
  }
});

class EditUserModal extends React.Component<
  Props & WithTranslation & EContextValue,
  State
> {
  public state = {
    user: this.props.user ? this.props.user : undefined
  };

  private handleEditUserChange = (event: any) => {
    if (this.state.user === undefined) {
      return;
    }
    const u: User = { ...this.state.user }
    switch (event.target.id) {
      case "zoomRoom":
        if (event.target.value.length > 10 || !isNumeric(event.target.value)) break;
        u.zoomRoom = event.target.value
        break;
    }
    this.setState({ user: u })
  }


  private handleSendRequest = async () => {
    if (!this.state.user) return;
    if (this.state.user.zoomRoom === this.props.user?.zoomRoom) {
      this.props.closeModal();
      return;

    }
    const response = await axios.put("/user", {
      id: this.state.user.id,
      zoomRoom: this.state.user.zoomRoom,
      verifiedProfilePic: this.props.user?.verifiedProfilePic,
      canClaimHelpRequests: this.state.user.canClaimHelpRequests
    });
    this.props.closeModal();
    if (response.status === 200) {
      toast("Updated user information", {
        type: "success",
      });
      this.props.setUser({ ...this.state.user })
    }
  };

  render() {
    const canSend: boolean = true && this.state.user !== undefined && this.state.user.zoomRoom?.length === 10;

    const isStudent = this.props.user?.role.toLocaleUpperCase() === "STUDENT";

    const verified = isStudent ? !this.props.user?.verifiedProfilePic ?
      <Typography color="error">Profile picture is not verified</Typography> : <Typography className={(this.props as any).classes.greenText}>Profile picture is verified</Typography> : null;

    if (!this.state.user) return <Loader />
    return (
      <div style={ModalStyle} className={(this.props as any).classes.paper}>
        {this.props.course?.profilePictures ? <>
        {this.state.user.needsProfilePic ? <p>No profile picture uploaded</p> :
          <div style={{ maxWidth: "400px", maxHeight: "400px" }}>
            <ProfilePicture disableInitials customUser={this.state.user} />
          </div>}{verified}</> : <></>
        }
        <TextField
          style={FormStyle}
          id="firstName"
          label="First name"
          disabled
          fullWidth
          value={this.state.user.firstName}
          onChange={this.handleEditUserChange}
        />
        <TextField
          style={FormStyle}
          id="lastName"
          label="Last name"
          fullWidth
          disabled
          value={this.state.user.lastName}
          onChange={this.handleEditUserChange}
        />
        <TextField
          style={FormStyle}
          id="userName"
          label="Username"
          disabled
          fullWidth
          value={this.state.user.userName}
          onChange={this.handleEditUserChange}
        />
        <TextField
          style={FormStyle}
          id="email"
          label="Email"
          disabled
          fullWidth
          value={this.state.user.email}
          onChange={this.handleEditUserChange}
        />
        {isStudent && !(this.props.course?.roomSetting?.localeCompare("PHYSICAL")===0)? <><TextField
          style={FormStyle}
          id="zoomRoom"
          label="Zoom ID"
          fullWidth
          value={this.state.user.zoomRoom ? this.state.user.zoomRoom : ""}
          onChange={this.handleEditUserChange}
        /></> : null}
        <SafeButton
          style={FormStyle}
          color="primary"
          onClick={this.handleSendRequest}
          variant="contained"
          disabled={!canSend}
        >
          Update my info
        </SafeButton>
        <Button style={{ float: "right", margin: "10px" }}
          onClick={this.props.closeModal}>Cancel</Button>
      </div>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(withUser()(EditUserModal))
);
