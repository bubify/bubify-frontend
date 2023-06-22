import {
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
import { CourseResponse } from "../../models/CourseResponse";
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
    optionalTableCellBody: {
      marginTop: "0px",
      verticalAlign: "top",
      textAlign: "start" as "start",
      // eslint-disable-next-line
      ['@media (max-width:800px)']: {
        display: "none" as "none"
      }
    },
    optionalColumn: {
      // eslint-disable-next-line
      ['@media (max-width:800px)']: {
        display: "none" as "none"
      }
    }
  })
);

const RemainingCheckBox = withStyles({
  root: {
    marginLeft: "10px",
    color: "#000000",
    "&$checked": {
      color: "#000000",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);


const UnlockedCheckBox = withStyles({
  root: {
    marginLeft: "10px",
    color: "#B2FF59",
    "&$checked": {
      color: "#B2FF59",
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

const PushedCheckBox = withStyles({
  root: {
    marginLeft: "10px",
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
  course: CourseResponse | null;
}

const AchievementsListTable = (props: Props) => {
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
    checkedRemaining: true,
    checkedAlwaysShowUnlocked: true
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
    if (!achievementsAll) fetchAchievements();
  }, [achievementsAll, props.customUser]);

  React.useEffect(() => {
    const filterAchievements = (
    ): AchievementsResponse[] => {
      if (!achievementsAll) return []
      return achievementsAll.filter((achievement) => {
        return (achievement.currentlyPushedBack && checkedState.checkedPushedBack) ||
          (achievement.unlocked && checkedState.checkedUnlocked) ||
          (!achievement.unlocked && checkedState.checkedRemaining && !achievement.currentlyPushedBack)
      });
    };
    setAchievementsFiltered(filterAchievements());
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

  const loading = !achievementsAll;
  return (
    <div>
      <Typography variant="h6" align="center" gutterBottom={true}>
        {t("AchievementListTable.title")}
      </Typography>
      <FormGroup row>
      <FormControlLabel
          control={
            <RemainingCheckBox
              checked={checkedState.checkedAlwaysShowUnlocked}
              onChange={handleChangeOfChecked}
              name="checkedAlwaysShowUnlocked"
            />
          }
          label={t("AchievementListTable.alwaysShowUnlocked")}
        ></FormControlLabel>
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
            <TableCell className={classes.optionalColumn}>
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
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <Skeleton6row3column />
          ) : (
              achievementsFiltered.map((achievement) => {
                if (
                  (mapTargetGradeEnumToNumber(achievement.level) <=
                  props.currentTarget) || (achievement.unlocked && checkedState.checkedAlwaysShowUnlocked)
                ) {
                  const colorRow = colorRowOnAchievementStatus(achievement);
                  return (
                    <TableRow
                      key={`achievement-list-table-id-${achievement.code}`}
                      style={colorRow}
                    >
                      <TableCell className={classes.optionalTableCellBody}>
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
                    </TableRow>
                  );
                }
                return null;
              })
            )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AchievementsListTable;
