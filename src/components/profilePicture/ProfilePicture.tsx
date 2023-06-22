import React from "react";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { nameInitials } from "../../utils/nameInitials";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

interface Props {
  customUser?: User;
  disableInitials?: boolean
  limitHeight?: boolean;
}

interface State {
  image: string;
  mounted: boolean;
}

class ProfilePicture extends React.Component<
  Props & EContextValue, State> {
  public state = {
    image: "",
    mounted: false
  }

  async componentDidMount() {
    const user = this.props.customUser ? this.props.customUser : this.props.user;

    const response = await axios.get("/user/profile-pic/" + user?.id, { responseType: "arraybuffer" });
    if (response !== undefined && response.data) {
      const blob = new Blob([response.data], {
        type: "image",
      });
      var objectURL = URL.createObjectURL(blob);
      this.setState({image: objectURL});
    }
    this.setState({mounted: true});
  }

  componentDidUpdate(prevProps: Props & EContextValue) {
    if (!this.state.mounted) return;
    const user = this.props.customUser ? this.props.customUser : this.props.user;
    if (this.props.course?.profilePictures === false) return;
    // Empty src defaults to base href
    if (this.state.image === "" || this.props.customUser !== prevProps.customUser) {
      const oldVal = this.state.image;

      axios
        .get("/user/profile-pic/" + user?.id, { responseType: "arraybuffer" })
        .then((response) => {
          if (response !== undefined && response.data) {
            const blob = new Blob([response.data], {
              type: "image",
            });
            var objectURL = URL.createObjectURL(blob);
            this.setState({image: objectURL}, () => URL.revokeObjectURL(oldVal));
          }
        }).catch(e => {
          if (e.response.status === 404) {
            if (oldVal !== "") this.setState({image: ""}, () => URL.revokeObjectURL(oldVal));
          }
        });
    }
  }

  render() {
    const user = this.props.customUser ? this.props.customUser : this.props.user;

    if (this.props.course?.profilePictures === false) {
      return <>{!this.props.disableInitials ? nameInitials(user) : ""}</>;
    }

    return (
      <>
          {this.props.limitHeight ?
            <img src={this.state.image} alt={!this.props.disableInitials ? nameInitials(user) : ""} style={{ maxHeight: "200px" }} /> :
            <img src={this.state.image} alt={!this.props.disableInitials ? nameInitials(user) : ""} style={{ maxWidth: "100%" }} />
          }
      </>
    );
  }
};

export default withUser()(ProfilePicture);
