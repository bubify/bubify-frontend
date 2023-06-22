export interface CourseResponse {
  name                     : string | null | undefined;
  startDate                : string | null | undefined;
  gitHubOrgURL             : string | null | undefined;
  piazzaURL                : string | null | undefined;
  matterMostURL            : string | null | undefined;
  courseWebURL             : string | null | undefined;
  studiumURL               : string | null | undefined;
  helpModule               : boolean | null | undefined;
  demoModule               : boolean | null | undefined;
  burndownModule           : boolean | null | undefined;
  statisticsModule         : boolean | null | undefined;
  examMode                 : boolean | null | undefined;
  onlyIntroductionTasks    : boolean | null | undefined;
  clearQueuesUsingCron     : boolean | null | undefined;
  studentDashboard         : boolean | null | undefined;
  roomSetting              : string | null | undefined;
  profilePictures          : boolean | null | undefined;
}
