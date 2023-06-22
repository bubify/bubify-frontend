import { AxiosResponse } from "axios";
import React from "react";
import { HelpRequest } from "../../models/HelpRequest";
import axios from "../../utils/axios";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
import { EContextValue } from "../userContext/UserContext";
import HelpTableTeacher from "./helpTable/HelpTableTeacher";
import { HelpTableData, processHelpRequests } from "./processHelpRequests";

const container = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};
const helpTable = {
  padding: "0px",
  width: "100%",
  display: "inline-block",
};

interface State {
  helpRequests: HelpTableData[] | undefined;
  recent: HelpRequest[] | undefined;
  selectUsersForRequest: boolean;
  canRequest: boolean;
  visibilityChange: () => void;
}

interface Props { }

class HelpTeacher extends React.Component<Props & EContextValue, State> {
  constructor(props: Props & EContextValue) {
    super(props);
    this.visibilityChange = this.visibilityChange.bind(this)
  }

  public state = {
    recent: undefined as HelpRequest[] | undefined,
    helpRequests: undefined as HelpTableData[] | undefined,
    selectUsersForRequest: false,
    canRequest: true
  } as State;

  private visibilityChange = () => {
    if (document.visibilityState === "visible") {
      this.getHelpRequests();
    }
  }

  componentDidUpdate(prevProps: EContextValue) {
    if (prevProps.reconnecting !== this.props.reconnecting && !this.props.reconnecting) {
      this.getHelpRequests();
      this.props.refreshData();
    }
  }

  async componentDidMount() {
    window.addEventListener("visibilitychange", this.visibilityChange);
    this.getHelpRequests();
    const subscriptionConfigs = [
      {
        destination: "/topic/helpRequest",
        callback: this.getHelpRequests.bind(this),
      },
    ]
    SubscriptionContext.getInstance().register(this.props.stompClient, subscriptionConfigs);
  }

  componentWillUnmount() {
    window.removeEventListener("visibilitychange", this.visibilityChange);
    SubscriptionContext.getInstance().unregister();
  }

  private async getHelpRequests() {
    try {
      const active: AxiosResponse<HelpRequest[]> = await axios.get(
        "/helpRequests/active"
      );
      const recent: AxiosResponse<HelpRequest[]> = await axios.get(
        "/recent/help"
      );
      this.setState({
        recent: recent.data,
        helpRequests: processHelpRequests(active.data),
      });
    } catch (e) { }
  }

  render() {
    return (
      <div style={container}>
        <div style={helpTable}>
          <HelpTableTeacher recent={this.state.recent} helpRequests={this.state.helpRequests} />
        </div>
      </div>
    );
  }
}

export default withUser()(HelpTeacher);
