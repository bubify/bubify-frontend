import { StatsResponse } from "./../../models/StatsResponse";
import { mapTargetGradeToEnum } from "./mapTargetGradeToEnum";

export const achievementsMax = (s: StatsResponse) => {
  switch (mapTargetGradeToEnum(s.currentTarget)) {
    case "GRADE_3":
      return s.achievementsPerLevel.GRADE_3;
    case "GRADE_4":
      return s.achievementsPerLevel.GRADE_4;
    case "GRADE_5":
      return s.achievementsPerLevel.GRADE_5;
    default:
      new Error("Never reach here");
  }
};

export const burnDown = (s: StatsResponse) => {
  switch (mapTargetGradeToEnum(s.currentTarget)) {
    case "GRADE_3":
      return s.burnDown.GRADE_3;
    case "GRADE_4":
      return s.burnDown.GRADE_4;
    case "GRADE_5":
      return s.burnDown.GRADE_5;
    default:
      new Error("Never reach here");
  }
};
