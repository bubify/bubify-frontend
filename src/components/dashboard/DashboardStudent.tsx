import {
  Paper,
  Theme,

  withStyles
} from "@material-ui/core";
import { AxiosResponse } from "axios";
import React from "react";
import { StatsResponse } from "../../models/StatsResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { mapTargetGradeToEnum } from "../../utils/functions/mapTargetGradeToEnum";
import BurnDownChart from "../burnDownChart";
import DashboardCardComponent from "../dashboardICardComponent";
import ProfilePicture from "../profilePicture";
import StatisticsCard from "../statisticsCard";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import AchievementsListTable from "./AchievementsListTable";
import AchievementsListTableTA from "./AchievementsListTableTA";

const styles = (theme: Theme) => ({
  container: {
    marginLeft: "0px",
    height: "100%",
  },
  // eslint-disable-next-line
  ['@media (max-width:800px)']: {
    container: {
      width: "100%",
      marginBottom: "10px",
      flexDirection: "column" as "column",
    }
  },
  paper: {
    padding: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column" as "column",
  },
  fixedHeightChart: {
    height: 480,
    // eslint-disable-next-line
    ['@media (max-width:1000px)']: {
      height: 530
    },
    // eslint-disable-next-line
    ['@media (max-width:900px)']: {
      height: 550
    },
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      height: 470
    },
    // eslint-disable-next-line
    ['@media (max-width:600px)']: {
      height: 520
    },
  },
  fixedHeight: {
    height: 480,
    // eslint-disable-next-line
    ['@media (max-width:1000px)']: {
      height: 530
    },
    // eslint-disable-next-line
    ['@media (max-width:900px)']: {
      height: 550
    },
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      height: 470
    },
    // eslint-disable-next-line
    ['@media (max-width:600px)']: {
      height: 540
    },
    // eslint-disable-next-line
    ['@media (max-width:480px)']: {
      height: 540
    },
  },
  paperAchievements: {
    height: "100%",
  },
  row: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    flexWrap: "wrap" as "wrap",
    gap: "10px",
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      flexDirection: "column" as "column",
      flexWrap: "unset" as "unset",
    },
    width: "100%",
  },
  column: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",
    flexBasis: "40%",
    flex: 1,
    width: "40%",
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      width: "100%"
    },
    marginBottom: "10px",
  }
});

interface Props {
  customUser?: User;
  refreshUser?: () => Promise<void>;
}

interface State {
  statisticsData: StatsResponse | undefined;
  selectedTargetGrade: number | undefined;
}

class DashboardStudent extends React.Component<Props & EContextValue, State> {
  state = {
    statisticsData: undefined,
    selectedTargetGrade: undefined,
  } as {
    statisticsData: StatsResponse | undefined;
    selectedTargetGrade: number | undefined;
  };

  private async updateTargetGrade(event: any) {
    if (this.props.customUser === undefined) {
      this.setState(() => ({ selectedTargetGrade: event.target.value }));
      await axios.post(
        "/targets",
        '"' + mapTargetGradeToEnum(event.target.value) + '"'
      );
      this.getStats();
    }
  }

  private async updateDeadline(target: string) {
    if (this.props.user === null) return;
    await axios.put("/user", {
      id: this.props.customUser === undefined ? this.props.user?.id : this.props.customUser?.id,
      verifiedProfilePic: this.props.customUser === undefined ? this.props.user?.verifiedProfilePic : this.props.customUser?.verifiedProfilePic,
      canClaimHelpRequests: this.props.customUser === undefined ? this.props.user?.canClaimHelpRequests : this.props.customUser?.canClaimHelpRequests,
      deadline: target
    });
    if (this.props.customUser === undefined && this.props.user !== null) {
      this.props.setUser({
        ...this.props.user,
        deadline: target
      });
    } else if (this.props.customUser !== undefined && this.props.refreshUser !== undefined) {
      this.props.refreshUser();
    }
    this.getStats();
  }

  private async getStats() {
    try {
      let response: AxiosResponse<StatsResponse>;
      if (this.props.customUser) {
        response = await axios.get("/stats/" + this.props.customUser.id);
      } else {
        response = await axios.get("/stats");
      }
      this.setState({
        statisticsData: response.data,
        selectedTargetGrade: response.data.currentTarget,
      });
    } catch (e) { }
  }

  refresh = async () => {
    if (this.props.customUser === undefined) { return; }
    const response = await axios.get("/stats/" + this.props.customUser.id);
    this.setState({
      statisticsData: response.data,
      selectedTargetGrade: response.data.currentTarget,
    });
  }

  async componentDidMount() {
    this.getStats();
  }

  componentDidUpdate(prevProps: Props & EContextValue) {
    if (this.props.customUser?.id !== prevProps.customUser?.id) {
      this.getStats();
    }
  }

  render() {
    const classes = (this.props as any).classes;
    const { statisticsData, selectedTargetGrade } = this.state;

    return (
      <div className={classes.container}>
        {this.props.customUser && !this.props.customUser.needsProfilePic ?
         <ProfilePicture limitHeight disableInitials customUser={this.props.customUser}/> : null}
        {!this.props.course?.onlyIntroductionTasks || this.props.customUser !== undefined ?
        <div className={classes.row}>
          {this.props.course?.statisticsModule ?
          <div className={classes.column}>
            <Paper className={classes.fixedHeight}>
              <DashboardCardComponent>
                <StatisticsCard
                  disableTargetGradeChange={this.props.customUser !== undefined}
                  statisticsData={statisticsData}
                  selectedTargetGrade={selectedTargetGrade}
                  targetGradeOnClick={this.updateTargetGrade.bind(this)}
                />
              </DashboardCardComponent>
            </Paper>
          </div> : null}
          {this.props.course?.burndownModule ?
          <div className={classes.column}>
            <Paper className={classes.fixedHeightChart}>
              <DashboardCardComponent>
                <BurnDownChart
                  statisticsData={statisticsData}
                  selectedTargetGrade={selectedTargetGrade}
                  deadline={this.props.customUser !== undefined ? this.props.customUser.deadline : this.props.user?.deadline}
                  startDate={this.props.course?.startDate}
                  updateDeadline={this.updateDeadline.bind(this)}
                />
              </DashboardCardComponent>
            </Paper>
          </div> : null}
        </div>
        : null}
        <div className={classes.row}>
          <div className={classes.column}>
            <Paper className={classes.paperAchievement}>
              {this.props.user?.role.toLocaleUpperCase() === "STUDENT" ?
                <AchievementsListTable
                  currentTarget={this.state.statisticsData?.currentTarget ? this.state.statisticsData?.currentTarget : 5}
                  customUser={this.props.customUser}
                  course={this.props.course}
                /> : <AchievementsListTableTA
                  currentTarget={this.state.statisticsData?.currentTarget ? this.state.statisticsData?.currentTarget : 5}
                  customUser={this.props.customUser}
                  refresh={this.refresh}
                />
              }
            </Paper>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(
  withUser()(DashboardStudent)
);
