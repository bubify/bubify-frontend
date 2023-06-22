import { Tooltip } from "@material-ui/core";
import React from "react";
import { User } from "../../models/User";
import { fullName } from "../../utils/fullName";
import ProfilePicture from "../profilePicture";

interface Props {
  examiner: User;
}
const ClaimedBy = (props: Props) => {
  return (
    <>
      <Tooltip
        title={
          props.examiner.needsProfilePic ? (
            ""
          ) : (
              <div style={{ margin: "10px", textAlign: "center" }}>
                <ProfilePicture customUser={props.examiner} disableInitials />
              </div>
            )
        }
      >
        <span style={{ display: "inline-block" }}>
          {fullName(props.examiner)}
        </span>
      </Tooltip>
    </>
  );
};
export default ClaimedBy;
