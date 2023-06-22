import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import BarChartIcon from '@material-ui/icons/BarChart';
import GraderIcon from '@material-ui/icons/Collections';
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import SettingsIcon from '@material-ui/icons/Settings';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import React from "react";
import { useTranslation } from "react-i18next";
import CourseSettings from "../courseSettings";
import DashboardAdmin from "../dashboard/DashboardAdmin";
import DrawerMenu, { AppContent } from "../drawerMenu/DrawerMenu";
import FirstTimeSetupTeacher from "../firstTimeSetup/FirstTimeSetupTeacher";
import Grader from "../grader";
import RevokeProfilePicture from "../revokeProfilePicture/RevokeProfilePicture";
import Statistics from "../statistics";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import UserManagement from "../userManagement/UserManagement";
import ViewStudent from "../viewStudent";

type TeacherNavigationProps = EContextValue;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedItem: {
      backgroundColor: "#F5F5F5",
    },
  })
);

function AdminNavigation(props: TeacherNavigationProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const logout = () => {
    props.clearStorage();
  };

  const menuItems = (
    <div style={{ height: "100%" }}>
      <List>
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
        <Tooltip title={t("Menu.statistics") as string}>
          <ListItem
            button
            key={t("Menu.statistics") as string}
            onClick={() => setValue(1)}
            className={value === 1 ? classes.selectedItem : undefined}
          >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.statistics")} />
          </ListItem>
        </Tooltip>
        <Tooltip title={t("Menu.grader") as string}>
          <ListItem
            button
            key={t("Menu.grader") as string}
            onClick={() => setValue(4)}
            className={value === 4 ? classes.selectedItem : undefined}
          >
            <ListItemIcon>
              <GraderIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.grader")} />
          </ListItem>
        </Tooltip>
        <>
          {props.user?.role.toLocaleUpperCase().localeCompare("TEACHER") === 0 ?
            <>
              <Tooltip title={t("Menu.revokeProfilePic") as string}>
                <ListItem
                  button
                  key={t("Menu.revokeProfilePic") as string}
                  onClick={() => setValue(2)}
                  className={value === 2 ? classes.selectedItem : undefined}
                >
                  <ListItemIcon>
                    <ThumbDownIcon />
                  </ListItemIcon>
                  <ListItemText primary={t("Menu.revokeProfilePic")} />
                </ListItem>
              </Tooltip>
            </>
            : null}
        </>
        <Tooltip title={t("Menu.students") as string}>
          <ListItem
            button
            key={t("Menu.students") as string}
            onClick={() => setValue(3)}
            className={value === 3 ? classes.selectedItem : undefined}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.students")} />
          </ListItem>
        </Tooltip>
        <Tooltip title={t("Menu.userManagement") as string}>
          <ListItem
            button
            key={t("Menu.userManagement") as string}
            onClick={() => setValue(5)}
            className={value === 5 ? classes.selectedItem : undefined}
          >
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.userManagement")} />
          </ListItem>
        </Tooltip>
        {props.user?.role.toLocaleUpperCase().localeCompare("TEACHER") === 0 ?
        <Tooltip title={t("Menu.settings") as string}>
          <ListItem
            button
            key={t("Menu.settings") as string}
            onClick={() => setValue(6)}
            className={value === 6 ? classes.selectedItem : undefined}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.settings")} />
          </ListItem>
        </Tooltip> : null}
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
    </div>
  );

  const contentItems = (
    <>
      <AppContent value={value} index={0}>
        <DashboardAdmin />
      </AppContent>
      <AppContent value={value} index={1}>
        <Statistics />
      </AppContent>
      <AppContent value={value} index={2}>
        <RevokeProfilePicture />
      </AppContent>
      <AppContent value={value} index={3}>
        <ViewStudent />
      </AppContent>
      <AppContent value={value} index={4}>
        <Grader />
      </AppContent>
      <AppContent value={value} index={5}>
        <UserManagement />
      </AppContent>
      <AppContent value={value} index={6}>
        <CourseSettings />
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

export default withUser()(AdminNavigation);
