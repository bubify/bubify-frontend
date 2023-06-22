import { Button, createStyles, Modal, TableCell, TableRow, Theme, Typography, withStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import MediaQuery from "react-responsive";
import { HelpRequest } from "../../models/HelpRequest";
import axios from "../../utils/axios";
import GenericTable from "../genericTable";
import SelectUsersHelpList from "../selectUsersHelpList";
import SimpleClaimTable from "../simpleClaimTable";
import { withUser } from "../userContext";
import { SubscriptionContext } from "../userContext/SubscriptionContext";
import { EContextValue } from "../userContext/UserContext";
import HelpTableStudent from "./helpTable/HelpTableStudent";
import { HelpTableData, processHelpRequests } from "./processHelpRequests";

const styles = (theme: Theme) =>
  createStyles({
    cell: {
      width: "40%",
    },
    timeCell: {
      minWidth: "2vh",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      flexDirection: "row" as "row",
      width: "100%",
    },
    helpTable: {
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
  helpRequests: HelpTableData[] | undefined;
  recentHelpRequests: HelpRequest[] | undefined;
  canRequest: boolean;
  selectUsersForRequest: boolean;
  visibilityChange: () => void;
}

class HelpStudent extends React.Component<
  WithTranslation & EContextValue,
  State
> {
  constructor(props: WithTranslation & EContextValue) {
    super(props);
    this.visibilityChange = this.visibilityChange.bind(this)
  }

  public state = {
    helpRequests: undefined,
    selectUsersForRequest: false,
    canRequest: false,
  } as State;

  private handleSelectUsersForRequest = () => {
    this.setState((prevState) => {
      const selectUsersForRequest = prevState.canRequest
        ? !prevState.selectUsersForRequest
        : false;
      return {
        selectUsersForRequest,
      };
    });
  };

  private handleRequestButton = (b: boolean) => {
    this.setState(() => ({
      canRequest: b,
    }));
  };

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
    document.addEventListener("visibilitychange", this.visibilityChange)
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
    document.removeEventListener("visibilitychange", this.visibilityChange);
    SubscriptionContext.getInstance().unregister();
  }

  private async getHelpRequests() {
    const response: AxiosResponse<HelpRequest[]> = await axios.get(
      "/helpRequests/active",
    );
    const hasHelpRequest = this.props?.user?.id
      ? response.data.some((helpRequest) =>
        helpRequest.submitters.some(
          (user) => user.id.toString() === this.props?.user?.id.toString()
        )
      )
      : false;
    this.setState({
      helpRequests: processHelpRequests(response.data),
      canRequest: !hasHelpRequest,
    }, this.getRecentHelpRequests);
  }

  private async getRecentHelpRequests() {
    const response: AxiosResponse<HelpRequest[]> = await axios.get(
      "/recent/student/help",
    );
    this.setState({recentHelpRequests: response.data});
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

    const recentRows = this.state.recentHelpRequests;
    const recentBody: JSX.Element | undefined = !recentRows ? undefined : (
      <>
        {recentRows.map((row) => (
          <TableRow key={row.id}>
            <TableCell align="left" className={classes.cell}>
              {row.helper === null ? <>--</> : row.helper.firstName + " " + row.helper.lastName}
            </TableCell>
            <TableCell align="left" className={classes.timeCell}>
              {new Date(row.requestTime).toLocaleString()}
            </TableCell>
          </TableRow>
        )
        )}
      </>
    );

    const recentHelpRequests = (<>
      <div style={{ marginTop: "10px" }}>
      <Typography variant="body1">
        <b>My recent requests</b>
      </Typography>
      </div>
      <div style={{ marginTop: "10px" }}>
        <GenericTable head={recentHead} body={recentBody} />
      </div>
    </>);

    return (<>
      <div className={classes.container}>
        <div className={classes.helpTable}>
          <HelpTableStudent helpRequests={this.state.helpRequests} />
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
              {this.props.t("HelpStudent.requestHelp")}
            </Button>
            <Modal
              open={this.state.selectUsersForRequest}
              onClose={this.handleSelectUsersForRequest}
            >
              <>
                <SelectUsersHelpList
                  handleDialog={this.handleSelectUsersForRequest}
                  handleRequestButton={this.handleRequestButton}
                />
              </>
            </Modal>
          </div>
          <div style={{ marginTop: "10px" }}>
            <SimpleClaimTable helpRequests={this.state.helpRequests} />
          </div>
          <MediaQuery minWidth={800}>
            {recentHelpRequests}
          </MediaQuery>
        </div>
      </div>
      <MediaQuery maxWidth={800}>
        {recentHelpRequests}
      </MediaQuery></>
    );
  }
}

export default withStyles(styles, { withTheme: true })(withTranslation()(withUser()(HelpStudent)));
