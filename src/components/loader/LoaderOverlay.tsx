import { CircularProgress, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import axios from "../../utils/axios";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    LoaderStyle: {
      textAlign: "center" as "center",
      position: "absolute" as "absolute",
      left: "50%",
      top: "50%",
      WebkitTransform: "translate(-50%, -50%)",
      transform: "translate(-50%, -50%)",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(3, 3, 3),
      background: 'rgba(255, 255, 255, 0)'
    }
  }));

const overlayStyle = {
  background: 'rgba(0, 0, 0, 0.5)',
  width: "100%",
  height: "100%",
  "z-index": "10000",
  top: "0",
  left: "0",
  position: "fixed" as "fixed"
}

const circularStyle = {
  color: "red",
}

export const LoaderOverlay = () => {
  React.useEffect(() => {
    // Ping every 20 seconds.
    const timer = setInterval(() => {
      axios.get("/ping");
    }, 20000);
    return () => {clearTimeout(timer);}
  }, []);

  const classes = styles();
  return (
    <div style={overlayStyle}>
      <div className={classes.LoaderStyle}>
        <CircularProgress style={circularStyle} />
        <Typography variant="subtitle2">Reconnecting</Typography>
      </div>
    </div>)
};
