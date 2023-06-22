import React from "react";

interface Props {
  children: any;
}

const DashboardCardComponent = (props: Props) => {
  return <div style={{ height: "450px" }}>{props.children}</div>;
};

export default DashboardCardComponent;
