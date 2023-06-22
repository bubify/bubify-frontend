import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  handleAgree: () => void;
  handleDisagree: () => void;
  open: boolean;
}

function AskNotifyPermissions(props: Props) {
  const { t } = useTranslation();
  return(
    <Dialog
      open={props.open}
      keepMounted
      onClose={props.handleDisagree}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">{t("AskNotifyPermissions.title")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t("AskNotifyPermissions.message")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleDisagree} color="primary">
          Disagree
        </Button>
        <Button onClick={props.handleAgree} color="primary">
          Agree
        </Button>
      </DialogActions>
    </Dialog>)
}

export default AskNotifyPermissions;