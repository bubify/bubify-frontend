import { IconButton, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Skeleton1row1column } from "../../../constantTemplates/SkeletonTable";
import axios from "../../../utils/axios";
import AchievementHoverLabel from "../../achievementHoverLabel";
import ConfirmationCancelAlert from "../../confirmationCancelAlert";
import GenericTable from "../../genericTable";
import PassedTime from "../../passedTime";
import { withUser } from "../../userContext";
import { EContextValue } from "../../userContext/UserContext";
import VideoCallButton from "../../videoCallButton";
import { DemonstrateTableData } from "../demonstrateTable/DemonstrateTableStudent";

const useStyles = makeStyles({
  table: {},
  cell: {
    width: "50%",
  },
  timeCell: {
    minWidth: "2vh",
  },
  myRequestTime: {
    textAlign: "center",
  },
  selectedAchievementsLabel: {
    marginTop: "15px",
    textAlign: "left",
  },
  selectedAchievements: {
    textAlign: "right",
  },
});

interface MyDemonstrateGoalTableStudentProps {
  demonstrateRequests: DemonstrateTableData[] | undefined;
}

function MyDemonstrateGoalTableStudent(
  props: MyDemonstrateGoalTableStudentProps & EContextValue
) {
  const { t } = useTranslation();
  const [cancelAlertOpen, setOpen] = React.useState(false);
  const [cancelRequestId, setCancelRequestId] = React.useState<null | string>(
    null
  );

  const handleClickOpen = (id: string) => {
    setCancelRequestId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const cancelRequest = async () => {
    if (cancelRequestId !== null) {
      try {
        const response = await axios.get(
          "/demonstration/cancel/" + cancelRequestId.toString()
        );
        if (response.status === 200) {
          toast(t("MyDemonstrateGoalTableStudent.toastRemovedRequest"), {
            type: "success",
          });
        }
      } catch (e) {}
    }
    handleClose();
  };

  const classes = useStyles();
  const rows = (props as MyDemonstrateGoalTableStudentProps)
    .demonstrateRequests;

  const head: JSX.Element = (
    <TableRow>
      <TableCell className={classes.cell} align="center">
        <Typography>{t("MyDemonstrateGoalTableStudent.myRequests")}</Typography>
      </TableCell>
    </TableRow>
  );

  const body: JSX.Element | undefined = !rows ? undefined : (
    <>
      {rows?.map((row) => {
        const ownedByUser =
          props !== null &&
          row.submitters.some((u) => {
            return u.id.toString() === props?.user?.id.toString();
          });
        let rowData;
        if (ownedByUser) {
          rowData = (
            <TableRow key={row.id}>
              <TableCell
                align="right"
                className={classes.cell}
                style={{ verticalAlign: "middle" }}
              >
                <div className={classes.myRequestTime}>
                  {t("MyDemonstrateGoalTableStudent.waitTime") + " "} 
                  <PassedTime date={row.time} />
                </div>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <div
                          className={classes.selectedAchievementsLabel}
                        >
                          {t(
                            "MyDemonstrateGoalTableStudent.selectedAchievements"
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Typography className={classes.selectedAchievements}>
                          {row.achievements.map((a) => (
                            <AchievementHoverLabel
                              key={`my-goal-label-${a.id}`}
                              code={a.code}
                              urlToDescription={a.urlToDescription}
                            />
                          ))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div>
                  {props.course?.roomSetting?.localeCompare("PHYSICAL") !== 0 && row.physicalRoom === null ?
                  <><VideoCallButton id={row.zoomRoom} />
                  </>
                  : <div style={{marginTop: "10px", marginLeft: "15px", textAlign: "left"}}>{"Room: " + row.physicalRoom}</div>}
                  <Tooltip
                    title={
                      t(
                        "MyDemonstrateGoalTableStudent.cancelMyRequestButton"
                      ) as string
                    }
                  >
                    <IconButton
                      aria-label="cancel"
                      onClick={() => handleClickOpen(row.id)}
                    >
                      <CloseIcon style={{ fill: "#FF0000" }} />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          );
        }
        return rowData;
      })}
    </>
  );

  return (
    <>
      <GenericTable
        skeleton={<Skeleton1row1column />}
        head={head}
        body={body}
      />
      <ConfirmationCancelAlert
        open={cancelAlertOpen}
        handleClose={handleClose}
        cancelRequest={cancelRequest}
      />
    </>
  );
}

export default withUser()(MyDemonstrateGoalTableStudent);
