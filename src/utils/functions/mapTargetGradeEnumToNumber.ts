export const mapTargetGradeEnumToNumber = (s: string) => {
  switch (s) {
    case "GRADE_3":
      return 3;
    case "GRADE_4":
      return 4;
    case "GRADE_5":
      return 5;
    default:
      throw new Error();
  }
};
