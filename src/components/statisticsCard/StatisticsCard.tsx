import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Theme,
  Tooltip, Typography,
  withStyles
} from "@material-ui/core";
import MuiTableCell from "@material-ui/core/TableCell";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatsResponse } from "../../models/StatsResponse";
import SelectGrade from "../selectGrade";

const TableCell = withStyles({
  root: {
    borderBottom: "none",
  },
})(MuiTableCell);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      height: 700,
    },
    table: {
      height: "100%",
    },
    tableCell: {
      marginTop: "0px",
      textAlign: "center" as "center",
      verticalAlign: "top",
    },
    dynamicFont: {
      fontSize: "3.5rem",
      // eslint-disable-next-line
      ['@media (max-width:350px)']: {
        fontSize: "2.5rem",
      },
      // eslint-disable-next-line
      ['@media (max-width:310px)']: {
        fontSize: "2.1rem",
      },
    },
    tableRow: {
      borderBottom: "0px solid",
    },
  })
);

interface Props {
  statisticsData: StatsResponse | undefined;
  selectedTargetGrade: number | undefined;
  targetGradeOnClick: (event: any) => void;
  disableTargetGradeChange?: boolean;
}

const StatisticsCard = (props: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { statisticsData, selectedTargetGrade, targetGradeOnClick } = props;
  const loading = !statisticsData || !selectedTargetGrade;
  return (
    <Table className={classes.table}>
      <TableHead />
      <TableBody>
        <TableRow>
          <TableCell className={classes.tableCell}>
            <Typography variant="h2" className={classes.dynamicFont}>
              {loading ? <Skeleton /> : statisticsData?.remaining}
            </Typography>
            <Typography>{t("StatisticsCard.achievementsRemaining")}</Typography>
          </TableCell>
          <TableCell className={classes.tableCell}>
            <Typography variant="h2" className={classes.dynamicFont}>
              {loading ? <Skeleton /> : statisticsData?.currentVelocity}
            </Typography>
            <Typography>{t("StatisticsCard.achievementThisWeek")}</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={classes.tableCell}>
            <Typography variant="h2" className={classes.dynamicFont}>
              {loading ? (
                <Skeleton />
              ) : (
                statisticsData?.averageVelocity.toFixed(1)
              )}
            </Typography>
            <Tooltip title="Average velocity is the total number of achievements you have unlocked / the number of weeks into the course">
              <Typography>
                {t("StatisticsCard.averageAchievementsWeek") as string}
              </Typography>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.tableCell}>
            <Typography variant="h2" className={classes.dynamicFont}>
              {loading ? (
                <Skeleton />
              ) : (
                statisticsData?.targetVelocity.toFixed(1)
              )}
            </Typography>
            <Typography>
              {t("StatisticsCard.targetAchievementsWeek") as string}
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className={classes.tableCell}>
              {loading ? (
                <Typography variant="h2" className={classes.dynamicFont}>
                  <Skeleton />
                </Typography>
              ) : (
                <SelectGrade
                  selectedTargetGrade={selectedTargetGrade as number}
                  targetGradeOnClick={targetGradeOnClick}
                  className={classes.dynamicFont}
                />
              )}
              <Typography>{t("StatisticsCard.myTargetGrade")}</Typography>
            </TableCell>
          <TableCell className={classes.tableCell}>
            <Typography variant="h2" className={classes.dynamicFont}>
              {loading ? (
                <Skeleton />
              ) : (
                statisticsData?.remainingWeeks.toFixed(2)
              )}
            </Typography>
            <Typography>
              {t("StatisticsCard.remainingWeeks") as string}
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default StatisticsCard;
