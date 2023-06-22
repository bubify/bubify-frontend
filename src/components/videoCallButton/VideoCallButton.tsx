import { IconButton, Tooltip } from "@material-ui/core";
import VoiceChatIcon from "@material-ui/icons/VoiceChat";
import React from "react";
import { openZoomUrl } from "../../utils/functions/openExternalUrl";

interface Props {
  id: string | null;
  disabled?: boolean;
}

function VideoCallButton(props: Props) {
  return (
    <Tooltip title="Link to Zoom">
      <IconButton aria-label="zoom" onClick={() => openZoomUrl(props.id)} disabled={props.disabled}>
        <VoiceChatIcon color="primary" />
      </IconButton>
    </Tooltip>
  );
}

export default VideoCallButton;
