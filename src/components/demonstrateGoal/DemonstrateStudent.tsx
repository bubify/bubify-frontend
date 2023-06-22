import { Button, createStyles, Modal, TableCell, TableRow, Theme, Typography, withStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import MediaQuery from "react-responsive";
import { DemonstrateRequest } from "../../models/DemonstrateRequest";
import axios from "../../utils/axios";
import GenericTable from "../genericTable";
import SelectGoalsToDemonstrate from "../selectGoalsToDemonstrate";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
import { EContextValue } from "../userContext/UserContext";
import DemonstrateTableStudent, { DemonstrateTableData } from "./demonstrateTable/DemonstrateTableStudent";
import MyDemonstrateGoalTableStudent from "./myDemonstrateGoalTableStudent";
import { processDemonstrateRequests } from "./processDemonstrateRequests";

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "row" as "row",
      width: "100%",
    },
    demonstrateTable: {
      padding: "0px",
      flex: "69%",
      display: "inline-block"
    },
    sideContainer: {
      marginTop: "0px",
      marginBottom: "0px",
      marginRight: "0px",
      marginLeft: "10px",
      // eslint-disable-next-line
      ['@media (maxWidth:800px)']: {
        marginLeft: "0px"
      },
      paddingBottom: "10px",
      flex: "30%",
    },
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      container: {
        flexDirection: "column-reverse" as "column-reverse",
      },
      sideContainer: {
        marginLeft: "0px"
      }
    },
});

interface State {
  demonstrateRequests: DemonstrateTableData[] | undefined;
  recentDemoRequests: DemonstrateRequest[] | undefined;
  canRequest: boolean;
  selectUsersForRequest: boolean;
  visibilityChange: () => void;
}

class DemonstrateStudent extends React.Component<
  WithTranslation & EContextValue,
  State
  > {
  constructor(props: WithTranslation & EContextValue) {
    super(props);
    this.visibilityChange = this.visibilityChange.bind(this)
  }

  public state = {
    demonstrateRequests: undefined,
    selectUsersForRequest: false,
    canRequest: false,
  } as State;

  private handleSelectUsersForRequest = () => {
    this.setState((prevState) => ({
      selectUsersForRequest: !prevState.selectUsersForRequest,
    }));
  };

  private handleRequestButton = (b: boolean) => {
    this.setState(() => ({
      canRequest: b,
    }));
  };

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

  private async getDemonstrationRequests() {
    try {
      const response: AxiosResponse<DemonstrateRequest[]> = await axios.get(
        "/demonstrations/activeAndSubmittedOrPickedUp"
      );
      const hasHelpRequest = this.props?.user?.id
        ? response.data.some((helpRequest) =>
          helpRequest.submitters.some(
            (user) => user.id.toString() === this?.props?.user?.id.toString()
          )
        )
        : false;
      this.setState({
        demonstrateRequests: processDemonstrateRequests(response.data),
        canRequest: !hasHelpRequest,
      }, this.getRecentDemoRequests);
    } catch (e) { }
  }

  private async getRecentDemoRequests() {
    const response: AxiosResponse<DemonstrateRequest[]> = await axios.get(
      "/recent/student/demo",
    );
    this.setState({recentDemoRequests: response.data});
  }

  render() {
    const { classes } = this.props as any;

    const recentHead: JSX.Element = (
      <TableRow>
        <TableCell className={classes.cell} align="left">
          Teacher
        </TableCell>
        <TableCell className={classes.timeCell} align="left">
          Time of request
        </TableCell>
      </TableRow>
    );

    const recentRows = this.state.recentDemoRequests;
    const recentBody: JSX.Element | undefined = !recentRows ? undefined : (
      <>
        {recentRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell align="left" className={classes.cell}>
              {row.examiner === null ? <>--</> : row.examiner.firstName + " " + row.examiner.lastName}
            </TableCell>
            <TableCell align="left" className={classes.timeCell}>
              {new Date(row.requestTime).toLocaleString()}
            </TableCell>
          </TableRow>
        )
        )}
      </>
    );

    const recentDemoRequests = (<>
      <div style={{ marginTop: "10px" }}>
      <Typography variant="body1">
        <b>My recent requests</b>
      </Typography>
      </div>
      <div style={{ marginTop: "10px" }}>
        <GenericTable head={recentHead} body={recentBody} />
      </div>
    </>);

    return (
      <>
        <div className={classes.container}>
          <div className={classes.demonstrateTable}>
            <DemonstrateTableStudent
              demonstrationRequests={this.state.demonstrateRequests}
            />
          </div>
          <div className={classes.sideContainer}>
            <div>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                startIcon={<CheckIcon />}
                disabled={!this.state.canRequest}
                onClick={this.handleSelectUsersForRequest}
              >
                {this.props.t("DemonstrateStudent.requestSlot")}
              </Button>
              <Modal
                open={this.state.selectUsersForRequest}
                onClose={this.handleSelectUsersForRequest}
              >
                <>
                  <SelectGoalsToDemonstrate
                    handleDialog={this.handleSelectUsersForRequest}
                    handleRequestButton={this.handleRequestButton}
                  />
                </>
              </Modal>
            </div>
            <div style={{ marginTop: "10px" }}>
              <MyDemonstrateGoalTableStudent
                demonstrateRequests={this.state.demonstrateRequests}
              />
            </div>
            <MediaQuery minWidth={800}>
              {recentDemoRequests}
            </MediaQuery>
          </div>
        </div>
        <MediaQuery maxWidth={800}>
          {recentDemoRequests}
        </MediaQuery>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(withUser()(DemonstrateStudent)));
