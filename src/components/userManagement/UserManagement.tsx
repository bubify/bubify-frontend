import { Paper, Tab, Tabs } from "@material-ui/core";
import React from "react";
import { withTranslation } from "react-i18next";
import AddUser from "../addUser";
import EditUser from "../editUser";


function UserManagement() {
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (event: unknown, newValue: number) => {
    setTab(newValue);
  };

  return (
    <>
      <Paper square style={{ marginBottom: "10px" }}>
        <Tabs
          value={tab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab label="Add user" />
          <Tab label="Edit user" />
        </Tabs>
      </Paper>
      { tab === 0 ? <AddUser /> : null}
      { tab === 1 ? <EditUser /> : null}
    </>
  )
}

export default withTranslation()(UserManagement);
