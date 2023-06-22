import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GradeIcon from "@material-ui/icons/Grade";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { mdiFaceAgent } from "@mdi/js";
import Icon from '@mdi/react';
import React from "react";
import { useTranslation } from "react-i18next";
import DashboardTA from "../dashboard/DashboardTA";
import DemonstrateTeacher from "../demonstrateGoal/DemonstrateTeacher";
import DrawerMenu, { AppContent } from "../drawerMenu/DrawerMenu";
import FirstTimeSetupTeacher from "../firstTimeSetup/FirstTimeSetupTeacher";
import HelpTeacher from "../help/HelpTeacher";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
type TeacherNavigationProps = EContextValue;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedItem: {
      backgroundColor: "#F5F5F5",
    },
  })
);

function TeacherNavigation(props: TeacherNavigationProps & EContextValue) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const logout = () => {
    props.clearStorage();
  };

  const menuItems = (
    <>
      <Tooltip title={t("Menu.dashboard") as string}>
        <ListItem
          button
          key={t("Menu.dashboard") as string}
          onClick={() => setValue(0)}
          className={value === 0 ? classes.selectedItem : undefined}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t("Menu.dashboard")} />
        </ListItem>
      </Tooltip>
      <List>
        {props.course?.helpModule ?
          <Tooltip title="List Help Requests">
            <ListItem
              button
              key="List Help Requests"
              onClick={() => setValue(1)}
              className={value === 1 ? classes.selectedItem : undefined}
            >
              <ListItemIcon>
                <Icon path={mdiFaceAgent} size={1} />
              </ListItemIcon>
              <ListItemText primary="List Help Requests" />
            </ListItem>
          </Tooltip> : <></>}
        {props.course?.demoModule ?
          <Tooltip title="List Demonstration Requests">
            <ListItem
              button
              key="List Demonstration Requests"
              onClick={() => setValue(2)}
              className={value === 2 ? classes.selectedItem : undefined}
            >
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
                <ListItemText primary="List Demonstration Requests" />
            </ListItem>
          </Tooltip> : <></>}
      </List>
      <Divider />
      <List>
        <Tooltip title={t("Menu.logout") as string}>
          <ListItem button key={t("Menu.logout") as string} onClick={logout}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.logout")} />
          </ListItem>
        </Tooltip>
      </List>
    </>
  );

  const contentItems = (
    <>
      <AppContent value={value} index={0}>
        <DashboardTA />
      </AppContent>
      <AppContent value={value} index={1}>
        <HelpTeacher />
      </AppContent>
      <AppContent value={value} index={2}>
        <DemonstrateTeacher />
      </AppContent>
    </>
  );

  const needSetup = (props.user?.needsProfilePic && props.course?.profilePictures);

  return (
    <>{!needSetup ?
        <DrawerMenu
          courseName={props.course?.name}
          menuItems={menuItems}
          contentItems={contentItems}
        /> : <FirstTimeSetupTeacher />
    }</>
  );
}

export default withUser()(TeacherNavigation);
