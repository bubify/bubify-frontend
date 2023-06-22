import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import React from "react";
import { Skeleton6row1column } from "../../constantTemplates/SkeletonTable";

const useStyles = makeStyles({
  table: {},
});

interface Props {
  disableSkeleton?: boolean;
  skeleton?: JSX.Element;
  head?: JSX.Element;
  body: JSX.Element[] | JSX.Element | undefined;
}

function GenericTable(props: Props) {
  const classes = useStyles();
  const { head, body, skeleton, disableSkeleton } = props;
  const defaultSkeleton = !disableSkeleton ? <Skeleton6row1column /> : null;
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="demonstrate table">
        {head ? <TableHead>{head}</TableHead> : defaultSkeleton}
        <TableBody>
          {!body && skeleton ? skeleton : null}
          {body}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GenericTable;
