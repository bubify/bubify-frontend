import { Button, makeStyles, TableCell, TableRow, Typography } from "@material-ui/core";
import React from "react";
import MediaQuery from "react-responsive";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { fullName } from "../../utils/fullName";
import ConfirmationCancelAlert from "../confirmationCancelAlert";
import GenericTable from "../genericTable";
import ProfilePicture from "../profilePicture";

interface Props {
  demonstrationId: string;
  handleDialog: () => void;
  usersNeedValidation: User[];
  handleVerifcation: (id: string) => Promise<void>;
}

const useStyles = makeStyles({
  optionalColumn: {
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      display: "none" as "none"
    }
  }
})

const ValidateProfilePicture = (props: Props) => {
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const classes = useStyles();
  const cancelDemoRequest = () => {
    try {
      axios.get("/demonstration/cancel/" + props.demonstrationId);
      props.handleDialog();
    } catch (e) { }
  }

  const handleCancelClose = () => {
    setCancelOpen(!cancelOpen);
  }
  
  const { usersNeedValidation } = props;

  const head = (<TableRow>
    <TableCell align="left" className={classes.optionalColumn}>
      Name
  </TableCell>
    <TableCell align="left">
      Profile Picture ({usersNeedValidation.length} to approve)
  </TableCell>
    <TableCell className={classes.optionalColumn} align="left">Verify Identify</TableCell>
  </TableRow>)

  const body: JSX.Element[] = [];
  for (let i = 0; i < 1; i++) {
    body.push(
      <TableRow key={`validate-profile-picture-id-${i}`}>
        <TableCell align="left" className={classes.optionalColumn}>
          {fullName(usersNeedValidation[i])}
        </TableCell>
        <TableCell align="center" style={{ minWidth: "50%" }}>
          {usersNeedValidation[i].needsProfilePic ? <Typography>No profile picture uploaded!</Typography> : <ProfilePicture limitHeight customUser={usersNeedValidation[i]} />}
          <MediaQuery maxWidth={800}>
            <p>{fullName(usersNeedValidation[i])} <Button disabled={usersNeedValidation[i].needsProfilePic} key={`confirm-profile-picture-${i}`} variant="contained" color="secondary"
              onClick={() => props.handleVerifcation(usersNeedValidation[i].id)}>
              Approve
                </Button></p>
          </MediaQuery>
        </TableCell>
        <TableCell align="left" className={classes.optionalColumn}>
          <Button disabled={usersNeedValidation[i].needsProfilePic} key={`confirm-profile-picture-${i}`} variant="contained" color="secondary"
            onClick={() => props.handleVerifcation(usersNeedValidation[i].id)}>
            I verify the validity of this profile picture
              </Button>
        </TableCell>
      </TableRow>
    );

  }
  return (
    <div><GenericTable head={head} body={body} />
      <Typography style={{ marginTop: "10px" }}>Unless every user have a validated profile picture we can't grade them. <span style={{ color: "red" }}>Only</span> press verify validity if you have seen a correct ID, passport etc.</Typography>
      <Button onClick={handleCancelClose}>Cancel the demonstration for all students</Button>
      <ConfirmationCancelAlert
        open={cancelOpen}
        handleClose={handleCancelClose}
        cancelRequest={cancelDemoRequest}
      />
    </div>
  )
}
export default ValidateProfilePicture;
