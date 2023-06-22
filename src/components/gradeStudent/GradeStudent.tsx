import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { sortSubmitters } from "../../utils/functions/sortSubmitters";
import AchievementHoverLabel from "../achievementHoverLabel";
import ProfilePicture from "../profilePicture";
import { SafeButton } from "../safeButton/SafeButton";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import ValidateProfilePicture from "../validateProfilePicture";

export interface SelectedDemonstration {
  demoId: string;
  submitters: User[];
  achievements: AchievementsResponse[];
}
type AchievementId = string;
type PFP = string; // Pass, Fail, Push back
type UserId = string;

interface Grade {
  achievementId: string;
  id: string;
  result: PFP;
}

interface GradeData {
  demoId: string;
  results: Grade[];
}

interface Props {
  handleDialog: () => void;
  selectedDemonstration: SelectedDemonstration;
}

interface State {
  usersNeedValidation: User[];
  sortedUsers: User[];
  sortedAchievements: AchievementsResponse[];
  grade: Map<UserId, Map<AchievementId, PFP>>;
  confirmedValues: boolean[][];
  confirmAssessment: boolean;
}

const ModalStyle = {
  position: "relative" as "relative",
  left: "5vw",
  top: "10vh",
  overflow: "auto"
};

const styles = (theme: Theme) => ({
  paper: {
    height: "80vh",
    width: "90vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  table: {
    overflow: "scroll"
  },
  profileColumn: {
    minWidth: "200px",
    maxWidth: "400px",
    maxHeight: "500px"
  },
  optionalColumn: {
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      display: "none" as "none"
    }
  }
});

class GradeStudent extends React.Component<
  Props & WithTranslation & EContextValue,
  State
  > {
  constructor(props: Props & WithTranslation & EContextValue) {
    super(props);

    this.state = {
      usersNeedValidation: [],
      sortedUsers: [],
      sortedAchievements: [],
      grade: new Map(),
      confirmAssessment: false,
      confirmedValues: [[]],
    };
  }

  componentDidMount() {
    const { selectedDemonstration } = this.props;
    if (!selectedDemonstration) return;
    const sortedAchievements = selectedDemonstration.achievements.sort((a, b) =>
      a.code.localeCompare(b.code)
    );
    const sortedUsers: User[] = selectedDemonstration.submitters.sort(
      sortSubmitters
    );
    const grade = this.state.grade;
    const confirmedValues: boolean[][] = new Array(sortedUsers.length)
      .fill(false)
      .map(() => new Array(sortedAchievements.length).fill(false));
    sortedUsers.forEach((u) => {
      grade.set(u.id, new Map());
      sortedAchievements.forEach((a) => {
        grade.get(u.id)?.set(a.id, "Fail");
      });
    });

    const usersNeedValidation: User[] = sortedUsers.filter(u => !u.verifiedProfilePic)

    this.setState({ sortedUsers, sortedAchievements, grade, confirmedValues, usersNeedValidation });
  }

  private handleSendRequest = async () => {
    const results: Grade[] = [];
    this.state.sortedUsers.forEach((u) => {
      this.state.sortedAchievements.forEach((a) => {
        const grade = this.state.grade?.get(u.id)?.get(a.id);
        if (!grade) throw new Error("Should always be defined at this point");
        results.push({
          id: u.id,
          achievementId: a.id,
          result: grade,
        });
      });
    });
    const gradeData: GradeData = {
      demoId: this.props.selectedDemonstration.demoId,
      results,
    };
    try {
      const response = await axios.post("/demonstration/done", gradeData);
      if (response.status === 200) {
        toast("Student was graded", {
          type: "success",
        });
      }
    } catch (e) { }
    this.props.handleDialog();
  };

  private handleTestify = async () => {
    this.setState((prevState) => ({
      confirmAssessment: !prevState.confirmAssessment,
    }));
  };

  private selectedRadioButton(uIndex: number, aIndex: number) {
    this.setState((prevState) => {
      prevState.confirmedValues[uIndex][aIndex] = true;
      return {
        confirmedValues: prevState.confirmedValues,
      };
    });
  }

  private async handleVerifcation(id: string) {
    const response = await axios.put("/user/profile-pic/" + id + "/verified")
    if (response.status === 200) {
      this.setState((prevState) => (
        {
          usersNeedValidation: prevState.usersNeedValidation.filter(u => u.id !== id)
        }))
    }

  }

  render() {
    const classes = (this.props as any).classes;
    const canSend: boolean = this.state.confirmAssessment;
    const mustConfirmIdentify = this.props.course?.profilePictures && this.state.usersNeedValidation.length > 0;
    return (
      <div style={ModalStyle} className={classes.paper}>
        {mustConfirmIdentify ?
          <ValidateProfilePicture
            demonstrationId={this.props.selectedDemonstration.demoId}
            handleDialog={this.props.handleDialog}
            usersNeedValidation={this.state.usersNeedValidation}
            handleVerifcation={this.handleVerifcation.bind(this)}
          /> :
          <FormGroup className={classes.table}>
            <TableContainer component={Paper}>
              <Table aria-label="grade table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.cell} align="left"></TableCell>
                    {this.state.sortedAchievements.map((a) => (
                      <TableCell
                        className={classes.timeCell}
                        key={`TableCell-Achievement-Label-${a.id}`}
                        align="left"
                      >
                        <AchievementHoverLabel
                          key={`GradeStudent-Achievement-Label-${a.id}`}
                          code={a.code}
                          urlToDescription={a.urlToDescription}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.sortedUsers.map((u, uIndex) => (
                    <TableRow key={`TableRow-GradeStudent-${u.id}`}>
                      <TableCell
                        key={`TableCell-name-${u.id}`}
                        className={`${classes.cell} ${classes.profileColumn}`}
                        align="left"
                      >
                        {u.firstName + " " + u.lastName}<br />
                        <ProfilePicture customUser={u} disableInitials key={`profile-pic-grading.${u.id}`} />
                      </TableCell>
                      {this.state.sortedAchievements.map((a, aIndex) => (
                        <TableCell
                          key={`TableCell-grade-${u.id}-${a.id}`}
                          className={classes.timeCell}
                          align="left"
                        >
                          <RadioGroup
                            value={this?.state?.grade?.get(u.id)?.get(a.id)}
                            aria-label="grading"
                            name="grade"
                            onClick={() => {
                              this.selectedRadioButton(uIndex, aIndex);
                            }}
                          >
                            {a.achievementType === "CODE_EXAM" ?
                              <>
                                <FormControlLabel
                                  value="Pass"
                                  control={<Radio />}
                                  label={this.props.t("GradeStudent.pass")}
                                  onClick={() => {
                                    this?.state?.grade?.get(u.id)?.set(a.id, "Pass");
                                  }}
                                />
                                <FormControlLabel
                                  value="Fail"
                                  control={<Radio />}
                                  label="Fail"
                                  onClick={() => {
                                    this?.state?.grade?.get(u.id)?.set(a.id, "Fail");
                                  }}
                                />
                              </>
                              :
                              <>
                                <FormControlLabel
                                  value="Pass"
                                  control={<Radio />}
                                  label={this.props.t("GradeStudent.pass")}
                                  onClick={() => {
                                    this?.state?.grade?.get(u.id)?.set(a.id, "Pass");
                                  }}
                                />
                                <FormControlLabel
                                  value="Fail"
                                  control={<Radio />}
                                  label={this.props.t("GradeStudent.fail")}
                                  onClick={() => {
                                    this?.state?.grade?.get(u.id)?.set(a.id, "Fail");
                                  }}
                                />
                                <FormControlLabel
                                  value="Pushback"
                                  control={<Radio />}
                                  label={this.props.t("GradeStudent.failPushback")}
                                  onClick={() => {
                                    this?.state?.grade
                                      ?.get(u.id)
                                      ?.set(a.id, "Pushback");
                                  }}
                                /></>}
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography
              onClick={this.handleTestify}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              <Checkbox checked={this.state.confirmAssessment} />
              {this.props.t("GradeStudent.testify")}
            </Typography>
            <SafeButton
              color="primary"
              onClick={this.handleSendRequest}
              variant="contained"
              disabled={!canSend}
            >
              {this.props.t("GradeStudent.confirm")}
            </SafeButton>
          </FormGroup>}
      </div>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(withUser()(GradeStudent))
);
