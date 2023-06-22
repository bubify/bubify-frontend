import Notify from "notifyjs";
import React from "react";
import { isDesktop } from "react-device-detect";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AskNotifyPermissions from "./components/askNotifyPermission";
import FirstTimeSystem from "./components/firstTimeSetup/FirstTimeSystem";
import { LoaderOverlay } from "./components/loader/LoaderOverlay";
import LoginNavigation from "./components/navigation/LoginNavigation";
import PrivilegedTeacherNavigation from "./components/navigation/PrivilegedTeacherNavigation";
import StudentNavigation from "./components/navigation/StudentNavigation";
import TeacherNavigation from "./components/navigation/TeacherNavigation";
import { withUser } from "./components/userContext";
import { EContextValue } from "./components/userContext/UserContext";

function App(props: EContextValue) {
  let rootComponent;
  if (props.user === null) {
    rootComponent = LoginNavigation;
  } else {
    if (props.user === undefined || props.user.role === undefined) {
      props.clearStorage();
    } else {
      switch (props.user.role.toUpperCase()) {
        case "STUDENT":
          rootComponent = StudentNavigation;
          break;
        case "JUNIOR_TA":
          rootComponent = TeacherNavigation;
          break;
        case "SENIOR_TA":
          rootComponent = PrivilegedTeacherNavigation;
          break;
        case "TEACHER":
          rootComponent = PrivilegedTeacherNavigation;
          break;
        case "SETUP_SYSTEM":
          rootComponent = FirstTimeSystem;
          break;
        default:
          rootComponent = LoginNavigation;
          break;
      }
    }
  }
  return (
    <>
      {props.reconnecting ? <LoaderOverlay /> : null}
        <>
        <Router>
          <Route path="/" component={rootComponent} />
        </Router>
        <ToastContainer
          hideProgressBar={true}
          position="top-center"
          transition={Slide}
        />
        <AskNotifyPermissions
          open={props.askPermission && Notify.needsPermission && isDesktop}
          handleAgree={() => {
            Notify.requestPermission(undefined, undefined);
            props.setAskPermission(false);
          }}
          handleDisagree={() => { props.setAskPermission(false) }}
        /></>
    </>
  );
}

export default withUser()(App);
