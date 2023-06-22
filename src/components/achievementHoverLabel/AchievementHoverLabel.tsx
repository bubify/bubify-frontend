import { Button, Tooltip } from "@material-ui/core";
import React from "react";
import { openExternalUrl } from "../../utils/functions/openExternalUrl";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

interface Props {
  urlToDescription: string;
  code: string;
}

const AchievementHoverLabel = (props: Props & EContextValue) => {
  return (
    <Tooltip title={props.achievementsMapper?.get(props.code) as string}>
      <Button
        disableFocusRipple
        disableRipple
        onClick={() => openExternalUrl(props.urlToDescription)}
      >
        {props.code}
      </Button>
    </Tooltip>
  );
};

export default withUser()(AchievementHoverLabel);
