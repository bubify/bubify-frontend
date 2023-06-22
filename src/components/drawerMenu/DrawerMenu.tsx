import { Avatar, Modal } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import { deepOrange } from "@material-ui/core/colors";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import LogoSmall from "../../images/logo/logo_small.png";
import { nameInitials } from "../../utils/nameInitials";
import AboutBubifyModal from "../aboutBubifyModal";
import EditUserModal from "../editUserModal";
import ProfilePicture from "../profilePicture/ProfilePicture";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
const drawerWidth = 289;

export interface ContentProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

export function AppContent(props: ContentProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      hidden={value !== index}
      id={`app-main-content-${index}`}
      aria-labelledby={`app-main-content-${index}`}
      {...other}
    >
      {value === index && (
        <Typography component={"span"}>{children}</Typography>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: "100%",
      height: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 0,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    mainContent: {
      marginLeft: "73px",
    },
    // eslint-disable-next-line
    ['@media (max-width:800px)']: {
      mainContent: {
        marginLeft: "0px",
      },
      drawerClose: {
        width: "0px"
      },
      drawer: {
        width: "0px"
      },
      drawerOpen: {
        width: drawerWidth
      }
    },
    rightSide: {
      marginLeft: "auto",
      padding: "8px",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
    },
  })
);

interface DrawerMenuProps {
  courseName: string | undefined | null;
  menuItems: JSX.Element;
  contentItems: JSX.Element;
}

function DrawerMenu(props: DrawerMenuProps & EContextValue) {
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [userSettingsOpen, setUserSettingsOpen] = React.useState(false);
  const [aboutOpen, setAboutOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const { user } = props;
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              <span>{props.courseName} &mdash; {t("DrawerMenu.applicationTitle")}<img onClick={() => { setAboutOpen(true) }} src={LogoSmall} alt="logo"
                style={{ verticalAlign: "middle", height: "2rem", marginLeft: "5px" }} /></span>
            </Typography>
            <div className={classes.rightSide} onClick={() => setUserSettingsOpen(true)}>
              <Avatar className={classes.orange}>
                {!user?.needsProfilePic ?
                  <ProfilePicture />
                  : nameInitials(user)}
              </Avatar>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <div onClick={handleDrawerClose} style={{ height: "100%" }}>
            {props.menuItems}
          </div>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.mainContent}>{props.contentItems}</div>
        </main>
      </div >
      <Modal
        open={userSettingsOpen}
        onClose={
          () => { setUserSettingsOpen(false) }
        }
      >
        <>
          <EditUserModal
            closeModal={() => setUserSettingsOpen(false)}
          />
        </>
      </Modal>
      <Modal
        open={aboutOpen}
        onClose={
          () => { setAboutOpen(false) }
        }
      >
        <AboutBubifyModal closeModal={() => { setAboutOpen(false) }} />
      </Modal>
    </>
  );
}

export default withUser()(DrawerMenu);
