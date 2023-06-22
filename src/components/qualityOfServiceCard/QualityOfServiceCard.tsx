import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  withStyles
} from "@material-ui/core";
import MuiTableCell from "@material-ui/core/TableCell";
import ClearIcon from "@material-ui/icons/Clear";
import Skeleton from "@material-ui/lab/Skeleton";
import { AxiosResponse } from "axios";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import MediaQuery from "react-responsive";
import { QualityOfServiceResponse } from "../../models/QualityOfServiceResponse";
import axios from "../../utils/axios";
import ConfirmationCancelAlert from "../confirmationCancelAlert";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

const TableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(MuiTableCell);

const styles = (theme: Theme) => ({
  root: {
    marginLeft: "0px",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column" as "column",
  },
  fixedHeight: {
    height: 450,
  },
  table: {
    height: "100%",
  },
  tableCell: {
    marginTop: "0px",
    textAlign: "center" as "center",
    verticalAlign: "top",
  },
  tableRow: {
    borderBottom: "0px solid",
  },
});

interface Props { }

interface State {
  qosData: QualityOfServiceResponse | undefined;
  helpListCancelDialogOpen: boolean;
  demoListCancelDialogOpen: boolean;
  timer: NodeJS.Timeout | undefined;
}

class QualityOfServiceCard extends React.Component<
  Props & WithTranslation & EContextValue,
  State
> {
  state = {
    qosData: undefined,
    demoListCancelDialogOpen: false,
    helpListCancelDialogOpen: false,
    timer: undefined
  } as {
    qosData: QualityOfServiceResponse | undefined;
    helpListCancelDialogOpen: boolean;
    demoListCancelDialogOpen: boolean;
    timer: NodeJS.Timeout | undefined;
  };

  private async getQoS() {
    try {
      const response: AxiosResponse<QualityOfServiceResponse> = await axios.get(
        "/qos"
      );
      this.setState({ qosData: response.data });
    } catch (e) { }
  }

  private async clearHelpRequests() {
    try {
      await axios.get("/helpRequests/clearList");
    } catch (e) { }
    this.getQoS();
    this.handleHelpConfirmation();
  }

  private async clearDemoRequests() {
    try {
      await axios.get("/demonstration/clearList");
    } catch (e) { }
    this.getQoS();
    this.handleDemoConfirmation();
  }

  private handleHelpConfirmation() {
    this.setState((prevState) => ({
      helpListCancelDialogOpen: !prevState.helpListCancelDialogOpen,
    }));
  }

  private handleDemoConfirmation() {
    this.setState((prevState) => ({
      demoListCancelDialogOpen: !prevState.demoListCancelDialogOpen,
    }));
  }

  componentDidMount() {
    this.getQoS();
    const timer = setInterval(() => this.getQoS(), 6000);
    this.setState({
      timer
    })
  }

  componentWillUnmount() {
    if (this.state.timer) {
      clearInterval(this.state.timer);
      this.setState({ timer: undefined });
    }
  }

  render() {
    const { t } = this.props;
    const classes = (this.props as any).classes;
    const {
      qosData,
      helpListCancelDialogOpen,
      demoListCancelDialogOpen,
    } = this.state;
    const loading = !qosData;

    return (
      <>
        <Table className={classes.table}>
          <TableHead />
          <TableBody>
            {this.props.course?.helpModule ?
              <TableRow>
                <TableCell className={classes.tableCell}>
                  <Typography variant="h3">
                    {loading ? <Skeleton /> : qosData?.helpRequestsPending}
                  </Typography>
                  <Typography>
                    {t("QualityOfServiceCard.helpRequestsPending")}
                    <Tooltip title="Clear help list">
                      <Button onClick={this.handleHelpConfirmation.bind(this)}>
                        <ClearIcon />
                      </Button>
                    </Tooltip>
                    <ConfirmationCancelAlert
                      open={helpListCancelDialogOpen}
                      cancelRequest={this.clearHelpRequests.bind(this)}
                      handleClose={this.handleHelpConfirmation.bind(this)}
                    />
                  </Typography>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Typography variant="h3">
                    {loading ? <Skeleton /> : qosData?.helpRequestsPickupTime}
                  </Typography>
                  <Typography>
                    {t("QualityOfServiceCard.helpRequestsPickupTime")}
                  </Typography>
                </TableCell>
                <MediaQuery minWidth={620}>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="h3">
                      {loading ? <Skeleton /> : qosData?.helpRequestsRoundtripTime}
                    </Typography>
                    <Typography>
                      {t("QualityOfServiceCard.helpRequestsRoundtripTime")}
                    </Typography>
                  </TableCell>
                </MediaQuery>
              </TableRow> : <></>}
            {this.props.course?.demoModule ?
              <TableRow>
                <TableCell className={classes.tableCell}>
                  <Typography variant="h3">
                    {loading ? <Skeleton /> : qosData?.demonstrationsPending}
                  </Typography>
                  <Typography>
                    {t("QualityOfServiceCard.demonstrationsPending")}
                  </Typography>
                  <Tooltip title="Clear demonstration list">
                    <Button onClick={this.handleDemoConfirmation.bind(this)}>
                      <ClearIcon />
                    </Button>
                  </Tooltip>
                  <ConfirmationCancelAlert
                    open={demoListCancelDialogOpen}
                    cancelRequest={this.clearDemoRequests.bind(this)}
                    handleClose={this.handleDemoConfirmation.bind(this)}
                  />
                </TableCell>
                <TableCell className={classes.tableCell}>
                  <Typography variant="h3">
                    {loading ? <Skeleton /> : qosData?.demonstrationsPickupTime}{" "}
                  </Typography>
                  <Typography>
                    {t("QualityOfServiceCard.demonstrationsPickupTime")}
                  </Typography>
                </TableCell>
                <MediaQuery minWidth={620}>
                  <TableCell className={classes.tableCell}>
                    <Typography variant="h3">
                      {loading ? (
                        <Skeleton />
                      ) : (
                        qosData?.demonstrationsRoundtripTime
                      )}
                    </Typography>
                    <Typography>
                      {t("QualityOfServiceCard.demonstrationsRoundtripTime")}
                    </Typography>
                  </TableCell>
                </MediaQuery>
              </TableRow>
              : <></>}
            <><MediaQuery maxWidth={620}>
              <TableRow>
                {this.props.course?.helpModule ?
                  <TableCell className={classes.tableCell}>
                    <Typography variant="h3">
                      {loading ? <Skeleton /> : qosData?.helpRequestsRoundtripTime}
                    </Typography>
                    <Typography>
                      {t("QualityOfServiceCard.helpRequestsRoundtripTime")}
                    </Typography>
                  </TableCell>
                  : <></>}
                {this.props.course?.demoModule ?
                  <TableCell className={classes.tableCell}>
                    <Typography variant="h3">
                      {loading ? (
                        <Skeleton />
                      ) : (
                        qosData?.demonstrationsRoundtripTime
                      )}
                    </Typography>
                    <Typography>
                      {t("QualityOfServiceCard.demonstrationsRoundtripTime")}
                    </Typography>
                  </TableCell> : <></>}
              </TableRow>
            </MediaQuery></>
            <TableRow>
              {qosData?.procentEverLoggedIn !== null ?
              <TableCell className={classes.tableCell}>
                <Typography variant="h3">
                  {loading ? <Skeleton /> : `${qosData?.procentEverLoggedIn}%`}
                </Typography>
                <Typography>
                  Students that has logged in at least once since genesis
                </Typography>
              </TableCell> : null}
              {qosData?.procentLoggedInLastTwoWeeks !== null  ?
              <TableCell className={classes.tableCell}>
                <Typography variant="h3">
                  {loading ? <Skeleton /> : `${qosData?.procentLoggedInLastTwoWeeks}%`}
                </Typography>
                <Typography>
                  Students that has logged in at least once since last 2 weeks
                </Typography>
              </TableCell> : null}
            </TableRow>
          </TableBody>
        </Table>
      </>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(withUser()(QualityOfServiceCard))
);
