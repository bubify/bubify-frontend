export const mapTargetGradeToEnum = (s: number) => {
  switch (s) {
    case 3:
      return "GRADE_3";
    case 4:
      return "GRADE_4";
    case 5:
      return "GRADE_5";
    default:
      new Error("Never reach here");
  }
};
