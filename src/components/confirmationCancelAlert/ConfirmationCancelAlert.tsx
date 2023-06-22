import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import React from "react";
import { useTranslation } from "react-i18next";
import { SafeButton } from "../safeButton/SafeButton";

interface Props {
  open: boolean;
  handleClose: () => void;
  cancelRequest: () => void;
}

const ConfirmationCancelAlert = function ConfirmationCancelAlert(props: Props) {
  const { t } = useTranslation();
  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("ConfirmationAlert.cancelRequest")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("ConfirmationAlert.noteUndone")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          {t("ConfirmationAlert.abort")}
        </Button>
        <SafeButton
          color="primary"
          variant="contained"
          onClick={props.cancelRequest}
        >
          {t("ConfirmationAlert.cancelRequestButton")}
        </SafeButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationCancelAlert;
