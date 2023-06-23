import { Client, StompSubscription } from "@stomp/stompjs";
import { AxiosError, AxiosResponse } from "axios";
import * as React from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import SockJS from "sockjs-client";
import {
  Achievements as AchievementsMap,
  AchievementsResponse
} from "../../models/AchievementsResponse";
import { CourseResponse } from "../../models/CourseResponse";
import { LoginResponse } from "../../models/LoginResponse";
import { User } from "../../models/User";
import axios from "../../utils/axios";
import { browserNotification } from "../../utils/browserNotification";
import { jsonToMap, mapToJson } from "../../utils/functions/convertMapJson";
import { kickoutToLogin } from "../../utils/kickoutToLogin";
import subscribe from "../../utils/subscribe";
import { SubscriptionContext } from "./SubscriptionContext";

const LOCAL_STORAGE_KEY_USER = "user";
const LOCAL_STORAGE_KEY_ACHIEVEMENTS_DATA = "achievements_data";
const LOCAL_STORAGE_KEY_ACHIEVEMENTS = "achievements";
const LOCAL_STORAGE_KEY_COURSE_INFO = "course";
const LOCAL_STORAGE_KEY_TOKEN = "token";
const LOCAL_STORAGE_ASK_PERMISSIONS = "ask_permissions";

interface ContextValue {
  token: string | null;
  user: User | null;
  course: CourseResponse | null;
  achievements: AchievementsResponse[] | null;
  achievementsMapper: AchievementsMap | null;
  stompClient: Client | null;
  askPermission: boolean;
  reconnecting: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  clearStorage: () => void;
  setCourse: (course: CourseResponse) => void;
  setAchievementsMapper: (achievements: AchievementsResponse[]) => void;
  setAskPermission: (askPermission: boolean) => void;
  refreshData: () => Promise<void>; // TODO: Create a single global point where this is triggered instead of scattered over the code base
}
export type EContextValue = ContextValue;

// interface Props {
//   children: React.ReactNode;
// }

function storeAskPermissions(askPermission: boolean) {
  if (localStorage) {
    localStorage.setItem(LOCAL_STORAGE_ASK_PERMISSIONS, JSON.stringify(askPermission));
  }
}

function storeUser(user: User) {
  if (localStorage) {
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, btoa(JSON.stringify(user)));
  }
}

function storeToken(token: string) {
  if (localStorage) {
    localStorage.setItem("token", token);
  }
}

function storeCourse(course: CourseResponse) {
  if (localStorage) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_COURSE_INFO,
      btoa(JSON.stringify(course))
    );
  }
}

function storeAchievements(achievements: AchievementsMap) {
  if (localStorage) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_ACHIEVEMENTS,
      btoa(JSON.stringify(mapToJson(achievements)))
    );
  }
}

function storeAchievementsData(achievements: AchievementsResponse[]) {
  if (localStorage) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_ACHIEVEMENTS_DATA,
      btoa(JSON.stringify(achievements))
    );
  }
}

function getAskPermission() {
  if (localStorage) {
    const askPermission = localStorage.getItem(LOCAL_STORAGE_ASK_PERMISSIONS);
    if (askPermission) {
      return JSON.parse(askPermission);
    }
  }
  return null;
}

function getToken() {
  if (localStorage) {
    return localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN);
  }
  return null;
}

function getCourse() {
  if (localStorage) {
    const course = localStorage.getItem(LOCAL_STORAGE_KEY_COURSE_INFO);
    if (course) {
      return JSON.parse(atob(course));
    }
  }
  return null;
}

function getAchievements(): Map<string, string> | null {
  if (localStorage) {
    const achievements = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
    if (achievements) {
      try {
        return jsonToMap(JSON.parse(atob(achievements))) as Map<string, string>;
      } catch (e) { }
    }
  }
  return null;
}

function getAchievementsData(): AchievementsResponse[] | null {
  if (localStorage) {
    const achievementsData = localStorage.getItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS_DATA);
    if (achievementsData) {
      try {
        return JSON.parse(atob(achievementsData)) as AchievementsResponse[];
      } catch (e) { }
    }
  }
  return null;
}

function getUser() {
  if (localStorage) {
    const user = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (user) {
      return JSON.parse(atob(user));
    }
  }
  return null;
}

const defaultFunction = () => {
  throw new Error("needs a provider as a parent");
};

const UserContext = React.createContext<ContextValue>({
  token: null,
  user: null,
  course: null,
  achievements: null,
  achievementsMapper: null,
  stompClient: null,
  askPermission: true,
  reconnecting: false,
  setToken: defaultFunction,
  setUser: defaultFunction,
  clearStorage: defaultFunction,
  setCourse: defaultFunction,
  setAchievementsMapper: defaultFunction,
  setAskPermission: defaultFunction,
  refreshData: defaultFunction
});

const UserProvider = withTranslation(["error"])(
  class UserProviderClass extends React.PureComponent<any> {
    public state = {
      token: null,
      user: null,
      course: null,
      achievementsData: null,
      achievements: null,
      stompClient: null,
      askPermission: true,
      reconnecting: false,
      subscriptions: [],
    } as {
      token: string | null;
      user: User | null;
      course: CourseResponse | null;
      achievementsData: AchievementsResponse[] | null;
      achievements: AchievementsMap | null;
      stompClient: Client | null;
      askPermission: boolean;
      reconnecting: boolean;
      subscriptions: StompSubscription[];
    };

    constructor(props: any) {
      super(props);
      const token = getToken();
      if (token) {
        this.state.stompClient = this.initStompClientInstance(token);
        axios.defaults.headers.token = token;
      }
      const user = getUser();
      if (user) {
        // Use local copy for fast inital loading and then
        // get new copy
        this.state.user = user;
        this.fetchAndSetUser();
      }
      const course = getCourse();
      if (course) {
        // Use local copy for fast inital loading and then
        // get new copy
        this.state.course = course;
        this.fetchAndSetCourse();
      }
      const achievements = getAchievements();
      if (achievements) {
        this.state.achievements = achievements;
      }
      const achievementsData = getAchievementsData();
      if (achievementsData) {
        this.state.achievementsData = achievementsData;
      }
      const askPermission = getAskPermission();
      if (askPermission !== null) {
        this.state.askPermission = askPermission;
      }
    }

    private refreshData = async () => {
      this.fetchAndSetCourse();
      this.fetchAndSetUser();
    }

    // Might have been updated since last time
    private fetchAndSetCourse = async () => {
      const newCourseResponse = await axios.get<CourseResponse>("/course");
      if (newCourseResponse.status === 200) {
        document.title = newCourseResponse.data.name + ' - Bubify';
        this.setState({
          course: newCourseResponse.data
        })
      }
    }

    private fetchAndSetUser = async () => {
      const newCourseResponse = await axios.get("/user");
      if (newCourseResponse.status === 200) {
        this.setState({
          user: newCourseResponse.data
        })
      }
    }

    public componentDidMount() {
      axios.interceptors.response.use(
        (response) => {
          return response;
        },
        (error: AxiosError) => {
          if (!error.response) {
            // Toast message here is not very helpful and risk spamming user
            // so disable in production
            if (process.env.REACT_APP_MODE === "development") {
              toast("Server is not reachable");
            }
            return;
          }
          const response = error.response;
          if (
            response.status === 400 ||
            response.status === 401 ||
            response.status === 403
          ) {
            toast(this.props.t("error:API." + response.data.message), {
              type: "error",
            });
            if (kickoutToLogin(response.data.message)) this.clearStorage();
            return;
          }
          if (response.status === 412) {
            toast("Session is invalid, please login to validate your session");
            this.clearStorage();
            return;
          }
          if (response.status === 500) {
            toast("A generic error occurred on the server");
            this.clearStorage();
            setTimeout(() => { document.location.reload(); }, 10);
            return;
          }
          return Promise.reject(error);
        }
      );
    }

    componentWillUnmount() {
      this.state.subscriptions.forEach((s) => s.unsubscribe());
      this.state.stompClient?.deactivate();
    }

    private setToken = (token: string) => {
      axios.defaults.headers.token = token;
      const stompClient = this.initStompClientInstance(token);
      this.setState(() => ({
        token,
        stompClient,
      }));
      storeToken(token);
    };

    private setUser = (user: User) => {
      storeUser(user);
      this.setState(() => ({
        user,
      }));
    };

    private clearStorage = async () => {
      document.title = 'Bubify'
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
      localStorage.removeItem(LOCAL_STORAGE_KEY_TOKEN);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS);
      localStorage.removeItem(LOCAL_STORAGE_KEY_ACHIEVEMENTS_DATA);
      localStorage.removeItem(LOCAL_STORAGE_KEY_COURSE_INFO);
      document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure";
      if (this.state.stompClient) {
        await this.state.stompClient.deactivate();
      }
      this.setState(() => ({
        user: null,
        token: null,
        stompClient: null,
        reconnecting: false,
      }));
      delete axios.defaults.headers.token;
    };

    private setCourse = (course: CourseResponse | undefined) => {
      if (course === undefined) return;
      storeCourse(course);
      document.title = course.name + ' - Bubify';
      this.setState({
        course,
      });
    };

    private setAskPermission = (askPermission: boolean) => {
      storeAskPermissions(askPermission);
      this.setState({
        askPermission: askPermission
      })
    }

    private setAchievements = (
      achievementsResponse: AchievementsResponse[]
    ) => {
      const achievements: AchievementsMap = new Map();
      achievementsResponse.forEach((a) => {
        achievements.set(a.code, a.name);
      });
      storeAchievements(achievements);
      storeAchievementsData(achievementsResponse);
      this.setState({
        achievements,
        achievementsData: achievementsResponse
      });
    };

    private notificationClaim = async (type: string, body: any) => {
      browserNotification(
        "Bubify",
        body + " claimed your " + type + " ticket"
      );
    };

    private refresehUserAndCourseData = async () => {
      const basicDataResponse: AxiosResponse<LoginResponse> = await axios.get(
        "/basicData");
      if (basicDataResponse.data.user) {
        this.setUser(basicDataResponse.data.user);
      }
      if (basicDataResponse.data.course) {
        this.setCourse(basicDataResponse.data.course);
      }
    };

    private refresehUserData = async () => {
      const basicDataResponse: AxiosResponse<User> = await axios.get(
        "/user");
      if (basicDataResponse) {
        this.setUser(basicDataResponse.data);
      }
    };

    private refresehCourse = async (rawCourse: string) => {
      this.setCourse(JSON.parse(rawCourse));
    };


    private clearedDemoList = async () => {
      toast("Demonstration list was cleared", { type: "warning" })
    }

    private clearedHelpList = async () => {
      toast("Help list was cleared", { type: "warning" })
    }

    private initStompClientInstance = (token: string) => {
      if (!process.env.REACT_APP_WEBSOCKET) {
        new Error("REACT_APP_WEBSOCKET undefined");
      }
      const url = process.env.REACT_APP_WEBSOCKET as string;

      const stompClient: Client = new Client({
        brokerURL: url,
        connectHeaders: {
          token,
        },
        reconnectDelay: 2000,
        heartbeatIncoming: 2000,
        heartbeatOutgoing: 2000,
        logRawCommunication: false,
      });

      stompClient.configure({
        onConnect: async (frame: any) => {
          this.setState({
            reconnecting: false,
            subscriptions: await subscribe(stompClient, [
              {
                destination: "/topic/claimedDemo/" + this.state.user?.id,
                callback: this.notificationClaim.bind(this, "demonstration"),
              },
              {
                destination: "/topic/claimedHelp/" + this.state.user?.id,
                callback: this.notificationClaim.bind(this, "help"),
              },
              {
                destination: "/topic/user/" + this.state.user?.id + "/basicData",
                callback: this.refresehUserAndCourseData
              },
              {
                destination: "/topic/user/" + this.state.user?.id + "/githubQueued",
                callback: this.refresehUserAndCourseData
              },
              {
                destination: "/topic/user/" + this.state.user?.id + "/refresh",
                callback: this.refresehUserData
              },
              {
                destination: "/topic/demonstration/cleared",
                callback: this.clearedDemoList,
              },
              {
                destination: "/topic/help/cleared",
                callback: this.clearedHelpList,
              },
              {
                destination: "/topic/course",
                callback: this.refresehCourse.bind(this)
              }
            ]),
          });
          SubscriptionContext.getInstance().reconnect(stompClient);
        },
        debug: (str: string) => {
          // if (process.env.NODE_ENV === "development") console.log(str);
        },
        onStompError: (frame: any) => {
          // if (process.env.REACT_APP_MODE === "development") console.log("Stomp Error", frame);
        },
        onDisconnect: (frame: any) => {
          // if (process.env.REACT_APP_MODE === "development") console.log("Stomp Disconnect", frame);
        },
        onWebSocketClose: (frame: any) => {
          this.setState({reconnecting: true})
          // if (process.env.REACT_APP_MODE === "development") console.log("Stomp WebSocket Closed", frame);
        },
        onWebSocketError: (frame: any) => {
          // if (process.env.REACT_APP_MODE === "development") console.log("Stomp WebSocket Error", frame);
        },
        webSocketFactory: () => {
          return SockJS(url);
        },
      });
      stompClient.activate();
      return stompClient;
    };

    public render() {
      return (
        <UserContext.Provider
          value={{
            askPermission: this.state.askPermission,
            token: this.state.token,
            stompClient: this.state.stompClient,
            user: this.state.user,
            setUser: this.setUser,
            clearStorage: this.clearStorage,
            course: this.state.course,
            setCourse: this.setCourse,
            setToken: this.setToken,
            achievements: this.state.achievementsData,
            achievementsMapper: this.state.achievements,
            setAchievementsMapper: this.setAchievements,
            setAskPermission: this.setAskPermission,
            reconnecting: this.state.reconnecting,
            refreshData: this.refreshData
          }}
        >
          {this.props.children}
        </UserContext.Provider>
      );
    }
  }
);
const UserConsumer = UserContext.Consumer;

export default UserContext;
export { UserConsumer, UserProvider };

