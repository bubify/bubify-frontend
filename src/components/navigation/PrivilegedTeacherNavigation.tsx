import { Button } from "@material-ui/core";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { User } from "../../models/User";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";
import AdminNavigation from "./AdminNavigation";
import StudentNavigation from "./StudentNavigation";
import TeacherNavigation from "./TeacherNavigation";

function PrivilegedTeacherNavigation(props: EContextValue) {
  const [route, setRoute] = React.useState<null | string>(null);

  const renderContext = () => {
    switch (route) {
      case "STUDENT":
        return <StudentNavigation />;
      case "TEACHER":
        return <TeacherNavigation />;
      case "ADMIN":
        return <AdminNavigation />;
      default:
        new Error("Never reach here");
    }
  };

  return (
    <>
      {!route ? (
        <>
          <Button
            onClick={() => {
              if (props.user != null) {
                // Fake user-role
                const fakeStudent: User = {
                  ...props.user,
                  role: "STUDENT"
                }
                props.setUser(fakeStudent);
                setRoute("STUDENT");
                }
              }
            }
          >
            Student mode
          </Button>
          <Button
            onClick={() => {
              setRoute("TEACHER");
            }}
          >
            Teacher mode
          </Button>
          <Button
            onClick={() => {
              setRoute("ADMIN");
            }}
          >
            Admin mode
          </Button>
        </>
      ) : (
        renderContext()
      )}
    </>
  );
}

export default withUser()(PrivilegedTeacherNavigation);
