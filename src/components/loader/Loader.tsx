import { CircularProgress } from "@material-ui/core";
import React from "react";

const LoaderStyle = {
  position: "absolute" as "absolute",
  left: "50%",
  top: "50%",
  WebkitTransform: "translate(-50%, -50%)",
  transform: "translate(-50%, -50%)",
};

export const Loader = () => (
  <div style={LoaderStyle}>
    <CircularProgress />
  </div>
);
