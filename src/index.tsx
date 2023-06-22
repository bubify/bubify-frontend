import { createTheme, MuiThemeProvider } from "@material-ui/core";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Loader } from "./components/loader/Loader";
import { UserProvider } from "./components/userContext";
import "./i18n";
import axios from "./utils/axios";

axios.defaults.baseURL = process.env.REACT_APP_API;
if (process.env.REACT_APP_MODE === "development") {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
}
axios.defaults.headers["content-type"] = "application/json";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6F7D8C",
    }
  },
});

ReactDOM.render(
  <React.Fragment>
    <Suspense fallback={<Loader />}>
      <UserProvider>
        <MuiThemeProvider theme={theme}>
          <App />
        </MuiThemeProvider>
      </UserProvider>
    </Suspense>
  </React.Fragment>,
  document.getElementById("root")
);
