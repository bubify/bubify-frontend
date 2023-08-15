import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GitHubIcon from "@material-ui/icons/GitHub";
import GradeIcon from "@material-ui/icons/Grade";
import SupportIcon from "@material-ui/icons/HeadsetMic";
import MenuBookIcon from "@material-ui/icons/MenuBook";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { mdiFaceAgent } from "@mdi/js";
import Icon from '@mdi/react';
import React from "react";
import { useTranslation } from "react-i18next";
import axios from "../../utils/axios";
import { openExternalUrl } from "../../utils/functions/openExternalUrl";
import DashboardStudent from "../dashboard/DashboardStudent";
import DemonstrateStudent from "../demonstrateGoal/DemonstrateStudent";
import DrawerMenu from "../drawerMenu";
import { AppContent } from "../drawerMenu/DrawerMenu";
import FirstTimeSetupStudent from "../firstTimeSetup/FirstTimeSetupStudent";
import HelpStudent from "../help/HelpStudent";
import HelpTeacher from "../help/HelpTeacher";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
type StudentNavigationProps = EContextValue;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedItem: {
      backgroundColor: "#F5F5F5",
    },
  })
);

function StudentNavigation(props: StudentNavigationProps) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [value, setValue] = React.useState(props.course?.statisticsModule ? 0 : 1);

  const logout = () => {
    props.clearStorage();
  };

  const menuItems = (
    <>
      <List>
      {props.course?.statisticsModule ?
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
            <ListItemText primary={t("Menu.dashboard") as string} />
          </ListItem>
        </Tooltip> : null }
        <>{props.course?.helpModule && !props.course.examMode ?
        <>
          <Tooltip title={t("Menu.requestHelp") as string}>
            <ListItem
              button
              key={t("Menu.requestHelp") as string}
              onClick={() => setValue(1)}
              className={value === 1 ? classes.selectedItem : undefined}
            >
              <ListItemIcon>
                <SupportIcon />
              </ListItemIcon>
              <ListItemText primary={t("Menu.requestHelp")} />
            </ListItem>
          </Tooltip>
          {props.user?.canClaimHelpRequests ?
          <Tooltip title="List Help Requests">
            <ListItem
              button
              key="List Help Requests"
              onClick={() => setValue(3)}
              className={value === 3 ? classes.selectedItem : undefined}
            >
              <ListItemIcon>
                <Icon path={mdiFaceAgent} size={1} />
              </ListItemIcon>
              <ListItemText primary="List Help Requests" />
            </ListItem>
          </Tooltip> : null}
          </>
           : null
           }</>
        {props.course?.demoModule ?
          <Tooltip title={t("Menu.demonstrateGoal") as string}>
            <ListItem
              button
              key={t("Menu.demonstrateGoal") as string}
              onClick={() => setValue(2)}
              className={value === 2 ? classes.selectedItem : undefined}
            >
              <ListItemIcon>
                <GradeIcon />
              </ListItemIcon>
              <ListItemText primary={t("Menu.demonstrateGoal")} />
            </ListItem>
          </Tooltip> : <></>}
      </List>
      {(props?.course?.gitHubOrgURL !== null || props?.course?.courseWebURL!== null) ? <Divider /> : null}
      <List>
        {props?.course?.gitHubOrgURL !== null ?
        <Tooltip title={(props?.user?.gitHubHandle === null ? "Link with GitHub" : props?.user?.gitHubRepoURL) as string}>
          <ListItem
            button
            key={t("Menu.myGithub") as string}
            onClick={() => openExternalUrl(props?.user?.gitHubHandle === null ? process.env.REACT_APP_API + "/authenticate-github?state=" + axios.defaults.headers.token : props?.user?.gitHubRepoURL)}
          >
            <ListItemIcon>
              <GitHubIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.myGithub") as string} />
          </ListItem>
        </Tooltip> : null}
        {props?.course?.courseWebURL !== null ? <Tooltip title={t("Menu.coursePage") as string}>
          <ListItem
            button
            key={t("Menu.coursePage") as string}
            onClick={() => openExternalUrl(props?.course?.courseWebURL)}
          >
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.coursePage") as string} />
          </ListItem>
        </Tooltip> : null}

        <Divider />
        <Tooltip title={t("Menu.logout") as string}>
          <ListItem button key={t("Menu.logout") as string} onClick={logout}>
            <ListItemIcon>
              <PowerSettingsNewIcon />
            </ListItemIcon>
            <ListItemText primary={t("Menu.logout") as string} />
          </ListItem>
        </Tooltip>
      </List>
    </>
  );

  const contentItems = (
    <>
      <AppContent value={value} index={0}>
        <DashboardStudent />
      </AppContent>
      <AppContent value={value} index={1}>
        <HelpStudent />
      </AppContent>
      <AppContent value={value} index={2}>
        <DemonstrateStudent />
      </AppContent>

      <AppContent value={value} index={3}>
        <HelpTeacher />
      </AppContent>
    </>
  );
  const needSetup = (props.user?.zoomRoom === null && props.course?.roomSetting?.localeCompare("PHYSICAL") !== 0) ||
                    (props.user?.needsProfilePic && props.course?.profilePictures);
  return (
    <>{needSetup ? <FirstTimeSetupStudent /> :
       <DrawerMenu
       courseName={props.course?.name}
       menuItems={menuItems}
       contentItems={contentItems}
     />}
    </>
  );
}

export default withUser()(StudentNavigation);
