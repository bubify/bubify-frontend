import {
  Button,
  CircularProgress,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import Slider from '@material-ui/core/Slider';
import React from "react";
import AvatarEditor from 'react-avatar-editor';
import ImageUploader from 'react-images-upload';
import MediaQuery from "react-responsive";
import axios from "../../utils/axios";
import ProfilePicture from "../profilePicture";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
import { EContextValue } from "../userContext/UserContext";

const styles = (theme: Theme) => ({
  fileUpload: {
    ...theme.typography
  },
  stageButtonFirst: {
    marginTop: "0px",
    // eslint-disable-next-line
    ['@media (max-width:710px)']: {
      marginTop: "auto"
    }
  },
  stageImage: {

  },
  stageButton: {
    marginTop: "10px",
    // eslint-disable-next-line
    ['@media (max-width:710px)']: {
      marginTop: "auto"
    }
  },
  stageArea: {
    "marginLeft": "10%",
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    // eslint-disable-next-line
    ['@media (max-width:710px)']: {
      display: "inherit"
    }
  }
});

interface Props {
  enableNext?: () => void;
}

interface State {
  profilePicture: File | undefined
  stagedPicture: string;
  profilePictureReady: ProfilePictureState;
  scale: number;
  rotate: number;
}

export enum ProfilePictureState {
  Uploading,
  Staging,
  Processing,
  Ready
}

class ProfilePictureUpload extends React.Component<Props & EContextValue, State> {
  constructor(props: Props & EContextValue) {
    super(props);
    this.editor = React.createRef();
  }
  editor: any;

  state = {
    profilePicture: undefined as undefined | File,
    stagedPicture: "",
    profilePictureReady: ProfilePictureState.Uploading,
    scale: 1,
    rotate: 0
  };

  private profilePictureProccessed = async () => {
    this.setState({
      profilePictureReady: ProfilePictureState.Ready,
    })
  }

  async componentDidMount() {
    const subscriptionConfigs = [
      {
        destination: "/topic/profilePicture/" + this.props.user?.id,
        callback: this.profilePictureProccessed.bind(this),
      },
    ]
    SubscriptionContext.getInstance().register(this.props.stompClient, subscriptionConfigs);
  }

  componentWillUnmount() {
    SubscriptionContext.getInstance().unregister();
  }

  private async stagePicture() {
    if (this.state.profilePicture === undefined) {
      return;
    }
    this.setState({
      profilePictureReady: ProfilePictureState.Staging,
      stagedPicture: URL.createObjectURL(this.state.profilePicture)
    })
  }

  private handleScale = (event: any, value: number | number[]) => {
    if (Array.isArray(value)) return;
    this.setState({ scale: value })
  }

  private rotateLeft = (event: any) => {
    event.preventDefault()
    this.setState({
      rotate: this.state.rotate - 90,
    })
  }

  private rotateRight = (event: any) => {
    event.preventDefault()
    this.setState({
      rotate: this.state.rotate + 90,
    })
  }

  private async uploadPicture() {
    if (this.state.profilePicture === undefined) {
      return;
    }
    this.setState({
      profilePictureReady: ProfilePictureState.Processing,
    })
    const data = new FormData()
    const f = this.state.profilePicture.name
    this.editor.getImage().toBlob(function (blob: any) {
      data.append('file', blob, f);
      axios.post("/user/upload-profile-pic", data)
    })
  }

  private async approveThumbnail() {
    const response = await axios.post("/user/approveThumbnail");
    if (response.status === 200) {
      if (this.props.enableNext) {
        this.props.enableNext();
      }
      this.props.setUser(response.data)
    }
  }

  private restartPicUpload() {
    this.setState(prevProps => {
      if (prevProps.stagedPicture !== "") {
        URL.revokeObjectURL(prevProps.stagedPicture);
        return ({
          stagedPicture: "" as string
        })
      }
      return ({stagedPicture: prevProps.stagedPicture});
    })
    this.setState({ profilePictureReady: ProfilePictureState.Uploading })
  }

  private onDrop(picture: File[]) {
    this.setState({ profilePicture: picture[0] }, this.stagePicture);
  }

  setEditorRef = (editor: any) => (this.editor = editor);

  render() {
    return (
      <div>
        {this.state.profilePictureReady === ProfilePictureState.Uploading ?
          <>
            <Typography>
              {this.props.user?.role.toUpperCase() === "STUDENT" ?
                <>Please upload a proflie picture,
                this picture will be used during examinations to verify your identify. You
                will be asked to re-upload this if it is of poor quality or contain multiple persons.
        <br /><br />
          At a later point in the course you will be asked to show proof of identity though
      ID card, passport etc. <b>If it doesn't match with your uploaded profile picture this will be reported</b>.</> :

                <>Please upload a proflie picture
      this picture will be used in conjunction when presenting your name.</>}
            </Typography>
            <ImageUploader
              className={(this.props as any).classes.fileUpload}
              withIcon={true}
              buttonText='Choose profile picture'
              onChange={this.onDrop.bind(this)}
              imgExtension={['.jpg', '.jpeg', '.png']}
              label="Max file size: 12mb, accepted: jpg,jpeg,png"
              maxFileSize={12582912}
              singleImage
              withPreview
            />
            </> : null}
        {this.state.profilePictureReady === ProfilePictureState.Staging ?
        <><div className={(this.props as any).classes.stageArea}>
          <AvatarEditor
            ref={this.setEditorRef}
            image={this.state.stagedPicture}
            scale={this.state.scale}
            width={100}
            height={100}
            border={80}
            color={[92, 106, 120, 0.6]} // RGBA
            rotate={this.state.rotate}
            className={(this.props as any).classes.stageImage}
          />
          <MediaQuery minWidth={710}>
            <div style={{display: "flex", flexDirection: "row"}}>
              <Slider
              value={this.state.scale}
              style={{height: 200}}
              orientation="vertical"
              onChange={this.handleScale}
              min={1}
              max={3}
              step={0.005}
              defaultValue={1}
              aria-labelledby="zoom-slider" />
              <div style={{display: "flex", flexDirection: "column"}}>
                <Button onClick={this.rotateLeft} className={(this.props as any).classes.stageButtonFirst}>Left</Button>
                <Button onClick={this.rotateRight} className={(this.props as any).classes.stageButton}>Right</Button>
                <Button onClick={this.restartPicUpload.bind(this)} className={(this.props as any).classes.stageButton}>Reset</Button>
                <Button variant="contained" color="primary" onClick={this.uploadPicture.bind(this)} className={(this.props as any).classes.stageButton}>Done</Button>
              </div>
            </div>
          </MediaQuery>

          <MediaQuery maxWidth={710}>
              <div><Slider
              value={this.state.scale}
              onChange={this.handleScale}
              min={1}
              max={3}
              step={0.005}
              defaultValue={1}
              aria-labelledby="zoom-slider" />
              <Button onClick={this.rotateLeft} className={(this.props as any).classes.stageButtonFirst}>Left</Button>
              <Button onClick={this.rotateRight} className={(this.props as any).classes.stageButton}>Right</Button>
              <Button onClick={this.restartPicUpload.bind(this)} className={(this.props as any).classes.stageButton}>Reset</Button>
              <Button variant="contained" color="primary" onClick={this.uploadPicture.bind(this)} className={(this.props as any).classes.stageButton}>Done</Button></div>
          </MediaQuery>
            </div>
        </> : null}
        {this.state.profilePictureReady === ProfilePictureState.Processing ? <div style={{ textAlign: "center" }}><CircularProgress /><br /><Typography>Processing...</Typography>
        </div> : null}
        {this.state.profilePictureReady === ProfilePictureState.Ready ? <Typography>Looks good?<br /><Button variant="contained" color="primary" style={{ margin: "10px" }} onClick={this.approveThumbnail.bind(this)}>Yes</Button><Button style={{ margin: "10px" }} onClick={this.restartPicUpload.bind(this)}>No</Button><br /><ProfilePicture disableInitials /></Typography> : null}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withUser()(ProfilePictureUpload)
);