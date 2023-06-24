import { Button, CircularProgress, createStyles, Theme, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { AxiosResponse } from "axios";
import crypto from "crypto";
import * as jwt from "jsonwebtoken";
import React from "react";
import { useTranslation } from "react-i18next";
import LogoSmall from "../../images/logo/logo_small.png";
import { AchievementsResponse } from "../../models/AchievementsResponse";
import { LoginResponse } from "../../models/LoginResponse";
import axios from "../../utils/axios";
import { openExternalUrl } from "../../utils/functions/openExternalUrl";
import { sleep } from "../../utils/sleep";
import { withUser } from "../userContext";
import { EContextValue } from "../userContext/UserContext";

type Props = EContextValue;

const style = {
  display: "flex",
  flexDirection: "column" as "column",
  justifyContent: "center",
  alignItems: "center" as "center",
  height: "90vh",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      // eslint-disable-next-line
      ['@media (max-width:350px)']: {
        fontSize: "4rem"
      },
    },
    logo: {
      height: "6rem",
      // eslint-disable-next-line
      ['@media (max-width:350px)']: {
        height: "4rem"
      }
    }
  }))


function LoginNavigation(props: Props) {
  const [casLoading, setCasLoading] = React.useState(false);
  const { t } = useTranslation();
  let simulateCAS: (id: string) => Promise<void> | undefined;
  simulateCAS = async function simulateCAS(username: string) {
    try {
      console.log('simulateCAS with ' + username)
      const suResponse = await axios.get("/su?username=" + username);
      const token = suResponse.data;
      const loginResponse: AxiosResponse<LoginResponse> = await axios.get(
        "/basicData",
        {
          headers: {
            token: token,
          },
        }
      );
      const achievementsResponse: AxiosResponse<
        AchievementsResponse[]
      > = await axios.get("/achievements", {
        headers: {
          token: token,
        },
      });
      console.log(token)
      props.clearStorage();
      props.setToken(token); //NB! must be first to be set
      props.setAchievementsMapper(achievementsResponse.data);
      props.setUser(loginResponse.data?.user);
      props.setCourse(loginResponse.data?.course);

    } catch (e) { }
  };

  const CAS = async () => {
    document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure";
    const MAX_RETIRES = 450; // 15 minutes limit
    setCasLoading(true);
    const id = crypto.randomBytes(64).toString("base64");
    openExternalUrl(process.env.REACT_APP_API + "/auth?id=" + id);
    await sleep(2000);
    let token: string | undefined;
    let i = 0;
    while (!token) {
      if (i > MAX_RETIRES) break;
      try {
        const response = await axios.get("/consume-token?id=" + id);
        if (response.data !== "error-no-such-key") {
          token = response.data;
        }
      } catch (e) { }

      await sleep(1000);
      i++;
    }

    if (!token) new Error();
    const decodedToken = jwt.decode(token as string);
    if (!decodedToken) new Error();

    const loginResponse: AxiosResponse<LoginResponse> = await axios.get(
      "/basicData",
      { headers: { token } }
    );
    const achievementsResponse: AxiosResponse<
      AchievementsResponse[]
    > = await axios.get("/achievements", { headers: { token } });

    setCasLoading(false);

    props.clearStorage();
    props.setToken(token as string); //NB! must be first to be set
    props.setAchievementsMapper(achievementsResponse.data);
    props.setUser(loginResponse.data.user);
    props.setCourse(loginResponse.data.course);
  };

  const developerLogin: JSX.Element | null =
    process.env.REACT_APP_MODE === "development" ? (
      <div style={{ position: "absolute" as "absolute", top: "0px" }}>
        <hr />
        <div>
          <h1>Dev Mode: Simulate CAS</h1>
          <p onClick={() => simulateCAS("axhu1234")}>
            Login as Axel Hultman (student)
          </p>
          <p onClick={() => simulateCAS("some0311")}>
            Login as Sofia Melin (junior TA)
          </p>
          <p onClick={() => simulateCAS("adalo9999")}>
            Login as Ada Lovelace (teacher)
          </p>
        </div>
        <hr />
      </div>
    ) : null;
  const classes = useStyles();
  return (
    <>
      <div style={style}>
        {casLoading ? (
          <CircularProgress />
        ) : (
          <div style={{ textAlign: "center", maxWidth: "400px", overflow: "auto" }}>
            <Typography className={classes.title} style={{marginBottom: "20px", whiteSpace: "nowrap"}} variant="h1">Bubify<img className={classes.logo} src={LogoSmall} alt="logo"
                style={{ verticalAlign: "middle", marginLeft: "5px" }} />
                </Typography><Typography style={{marginBottom: "60px"}}  variant="subtitle1">Greetings dear IOOPM participant</Typography>
                <br/>

            <Button style={{ marginBottom: "30px" }} variant="contained" color="primary" onClick={() => CAS()}>
              {t("LoginNavigation.login")}
            </Button>
            <br />
            <Button color="primary" onClick={() => openExternalUrl("https://weblogin.uu.se/idp/profile/cas/logout")}>
              {t("LoginNavigation.logout")}
            </Button>
            <br /><br />
            <div style={{maxWidth: "400px"}}>
            <i>GDPR Note:

We keep information about your progress and request for a time slot for up to 2 years. This expiry clock is reset if you do any kind of interaction, e.g., login, demonstrate, etc. We use the data to track your progress on the course, and as grounds for entering grades into LADOK.

Your email may be used to send you information about code exams, or follow-up on your progress. When you use this system we use cookies to keep track of your authentication.</i>
            </div>

          </div>
        )}
      </div>
      {developerLogin}
    </>
  );
}

export default withUser()(LoginNavigation);
