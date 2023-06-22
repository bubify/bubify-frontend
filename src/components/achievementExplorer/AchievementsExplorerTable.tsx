import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { useTranslation } from "react-i18next";
import { AchievementExploreResponse } from "../../models/AchievementExploreResponse";
import { User } from "../../models/User";

const useStyles = makeStyles({
  table: {},
  cell: {
    width: "45%",
  },
  timeCell: {
    minWidth: "2vh",
  },
});

interface Props {
  data: AchievementExploreResponse;
}

function AchievementsExplorerTable(props: Props) {
  const { t } = useTranslation();
  const classes = useStyles();

  const getName = (u: User | undefined) => {
    if (!u) return <p></p>;
    return u.firstName + " " + u.lastName;
  };

  const rows = props.data;
  const rowLength = Math.max(
    rows.remaining.length,
    rows.struggling.length,
    rows.unlocked.length
  );
  const rowElement: JSX.Element[] = [];
  for (let i = 0; i < rowLength; i++) {
    rowElement.push(
      <TableRow key={`achievements-explorer-row-id-${i}`}>
        <TableCell align="left" className={classes.cell}>
          {getName(rows.unlocked[i])}
        </TableCell>
        <TableCell align="left" className={classes.timeCell}>
          {getName(rows.remaining[i])}
        </TableCell>
        <TableCell align="left">{getName(rows.struggling[i])}</TableCell>
      </TableRow>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="demonstrate table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.cell} align="left">
              {t("AchievementsExplorerTable.unlocked") + " (" + rows.unlocked.length + ")"}
            </TableCell>
            <TableCell className={classes.timeCell} align="left">
              {t("AchievementsExplorerTable.remaining") + " (" + rows.remaining.length + ")"}
            </TableCell>
            <TableCell align="left">
              {t("AchievementsExplorerTable.struggling") + " (" + rows.struggling.length + ")"}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rowElement}</TableBody>
      </Table>
    </TableContainer>
  );
}

export default AchievementsExplorerTable;
