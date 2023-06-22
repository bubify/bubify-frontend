import { AxiosResponse } from "axios";
import React from "react";
import { DemonstrateRequest } from "../../models/DemonstrateRequest";
import axios from "../../utils/axios";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
import { EContextValue } from "../userContext/UserContext";
import { DemonstrateTableData } from "./demonstrateTable/DemonstrateTableStudent";
import DemonstrateTableTeacher from "./demonstrateTable/DemonstrateTableTeacher";
import { processDemonstrateRequests } from "./processDemonstrateRequests";

const container = {
  display: "flex",
  justifyContent: "center",
  width: "100%",
};

const demonstrateTable = {
  padding: "0px",
  width: "100%",
  display: "inline-block",
};

interface State {
  recent: DemonstrateRequest[] | undefined,
  demonstrateRequests: DemonstrateTableData[] | undefined;
  visibilityChange: () => void;
}

interface Props { }

class DemonstrateTeacher extends React.Component<Props & EContextValue, State> {
  public state = {
    recent: undefined as DemonstrateRequest[] | undefined,
    demonstrateRequests: undefined as DemonstrateTableData[] | undefined,
  } as State;

  constructor(props: Props & EContextValue) {
    super(props);
    this.visibilityChange = this.visibilityChange.bind(this)
  }

  private async getDemonstrationRequests() {
    try {
      const response: AxiosResponse<DemonstrateRequest[]> = await axios.get(
        "/demonstrations/activeAndSubmittedOrPickedUp"
      );
      const recent: AxiosResponse<DemonstrateRequest[]> = await axios.get(
        "/recent/demo"
      );
      this.setState({
        recent: recent.data,
        demonstrateRequests: processDemonstrateRequests(response.data),
      });
    } catch (e) { }
  }

  private visibilityChange = () => {
    if (document.visibilityState === "visible") {
      this.getDemonstrationRequests();
    }
  }

  componentDidUpdate(prevProps: EContextValue) {
    if (prevProps.reconnecting !== this.props.reconnecting && !this.props.reconnecting) {
      this.getDemonstrationRequests();
      this.props.refreshData();
    }
  }

  async componentDidMount() {
    window.addEventListener("visibilitychange", this.visibilityChange);
    this.getDemonstrationRequests();
    const subscriptionConfigs = [
      {
        destination: "/topic/demoRequest",
        callback: this.getDemonstrationRequests.bind(this),
      },
    ]
    SubscriptionContext.getInstance().register(this.props.stompClient, subscriptionConfigs);
  }

  componentWillUnmount() {
    window.removeEventListener("visibilitychange", this.visibilityChange);
    SubscriptionContext.getInstance().unregister();
  }

  render() {
    return (
      <div style={container}>
        <div style={demonstrateTable}>
          <DemonstrateTableTeacher
            recent={this.state.recent}
            demonstrationRequests={this.state.demonstrateRequests}
          />
        </div>
      </div>
    );
  }
}

export default withUser()(DemonstrateTeacher);
