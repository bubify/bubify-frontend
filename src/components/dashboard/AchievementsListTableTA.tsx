import {
  Button,
  Checkbox,
  CheckboxProps, createStyles,
  FormControlLabel,
  FormGroup, makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Typography,
  withStyles
} from "@material-ui/core";
import { AxiosResponse } from "axios";
import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton6row3column } from "../../constantTemplates/SkeletonTable";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { mapTargetGradeEnumToNumber } from "../../utils/functions/mapTargetGradeEnumToNumber";
import AchievementHoverLabel from "../achievementHoverLabel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fixedHeight: {
      height: 100,
    },
    table: {
      height: "100%",
    },
    tableCell: {
      marginTop: "0px",
      textAlign: "center" as "center",
      verticalAlign: "top",
    },
    tableCellBody: {
      marginTop: "0px",
      verticalAlign: "top",
      textAlign: "start" as "start",
    },
    tableRow: {
      borderBottom: "1px solid",
    },
  })
);

const RemainingCheckBox = withStyles({
  root: {
    marginLeft: "5px",
    color: "#000000",
    "&$checked": {
      color: "#000000",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);


const UnlockedCheckBox = withStyles({
  root: {
    marginLeft: "5px",
    color: "#B2FF59",
    "&$checked": {
      color: "#B2FF59",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

const PushedCheckBox = withStyles({
  root: {
    marginLeft: "5px",
    color: "#FFC107",
    "&$checked": {
      color: "#FFC107",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

interface Props {
  customUser?: User;
  currentTarget: number;
  refresh: () => void;
}

const AchievementsListTableTA = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [achievementsAll, setAchievementsAll] = React.useState<
    AchievementsResponse[] | undefined
  >(undefined);

  const [achievementsFiltered, setAchievementsFiltered] = React.useState<
    AchievementsResponse[]
  >([]);

  const [checkedState, setCheckedState] = React.useState({
    checkedPushedBack: true,
    checkedUnlocked: true,
    checkedRemaining: true
  });

  React.useEffect(() => {
    const fetchAchievements = async () => {
      let achievements: AxiosResponse<
        AchievementsResponse[]
      >;
      if (props.customUser) {
        achievements = await axios.get("/remaining/all/" + props.customUser.id);
      } else {
        achievements = await axios.get("/remaining/all");
      }
      setAchievementsAll(achievements.data);
    };
    if (!achievementsAll || props.customUser) {
      fetchAchievements();
    }
    // eslint-disable-next-line
  }, [props.customUser]);

  React.useEffect(() => {
    const filterAchievements = (
    ): AchievementsResponse[] => {
      if (!achievementsAll) return []
      return achievementsAll.filter((achievement) => {
        return (achievement.currentlyPushedBack && checkedState.checkedPushedBack) ||
          (achievement.unlocked && checkedState.checkedUnlocked) ||
          (!achievement.unlocked && checkedState.checkedRemaining && !achievement.currentlyPushedBack)
      });
    };    setAchievementsFiltered(filterAchievements());

  }, [checkedState, achievementsAll]);

  const colorRowOnAchievementStatus = (
    a: AchievementsResponse
  ): React.CSSProperties | undefined => {
    if (a.unlocked) {
      return { backgroundColor: "#B2FF59" };
    }
    if (a.currentlyPushedBack) {
      return { backgroundColor: "#FFC107" };
    }
  };

  /* 
    @pre: name of CheckBox component is the same as the name of attr. corresponding to its checked status inside checkedState
  */
  const handleChangeOfChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCheckedState({
      ...checkedState,
      [event.target.name]: event.target.checked,
    });
  };

  const handleUnlock = async (achievement: string) => {
    if (props.customUser === undefined) return;
    const response = await axios.post("/grade/group", {
      username: props.customUser.userName,
      achievements: [achievement]
    });
    if (response.data === "SUCCESS") {
      props.refresh();
      const achievements = await axios.get("/remaining/all/" + props.customUser.id);  
      setAchievementsAll(achievements.data);
    }
  }

  const loading = !achievementsAll;
  return (
    <>
      <Typography variant="h6" align="center" gutterBottom={true}>
        {t("AchievementListTable.title")}
      </Typography>
      <FormGroup row>
        <FormControlLabel
          control={
            <RemainingCheckBox
              checked={checkedState.checkedRemaining}
              onChange={handleChangeOfChecked}
              name="checkedRemaining"
            />
          }
          label={t("AchievementListTable.showRemaining")}
        ></FormControlLabel>
        <FormControlLabel
          control={
            <UnlockedCheckBox
              checked={checkedState.checkedUnlocked}
              onChange={handleChangeOfChecked}
              name="checkedUnlocked"
            />
          }
          label={t("AchievementListTable.showUnlocked")}
        ></FormControlLabel>
        <FormControlLabel
          control={
            <PushedCheckBox
              checked={checkedState.checkedPushedBack}
              onChange={handleChangeOfChecked}
              name="checkedPushedBack"
            />
          }
          label={t("AchievementListTable.showPushed")}
        ></FormControlLabel>
      </FormGroup>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography>{t("AchievementListTable.achievement")}</Typography>
            </TableCell>
            <TableCell>
              <Typography>
                {t("AchievementListTable.shortDescription")}
              </Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>{t("AchievementListTable.gradeLevel")}</Typography>
            </TableCell>
            <TableCell className={classes.tableCell}>
              <Typography>{t("AchievementListTable.unlock")}</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <Skeleton6row3column />
          ) : (
              achievementsFiltered.map((achievement) => {
                  const colorRow = colorRowOnAchievementStatus(achievement);
                  return (
                    <TableRow
                      key={`achievement-list-table-id-${achievement.code}`}
                      style={colorRow}
                    >
                      <TableCell className={classes.tableCellBody}>
                        <AchievementHoverLabel
                          code={achievement.code}
                          urlToDescription={achievement.urlToDescription}
                        ></AchievementHoverLabel>
                      </TableCell>
                      <TableCell className={classes.tableCellBody}>
                        <Typography>{achievement.name}</Typography>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Typography>
                          {mapTargetGradeEnumToNumber(achievement.level)}
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.tableCell}>
                        <Button onClick={() => handleUnlock(achievement.code)}>Pass</Button>
                      </TableCell>
                    </TableRow>
                  );
              })
            )}
        </TableBody>
      </Table>
    </>
  );
};

export default AchievementsListTableTA;
