export interface StatsResponse {
  remaining: number;
  remainingWeeks: number;
  weeksNeeded: number;
  currentVelocity: number;
  averageVelocity: number;
  targetVelocity: number;
  currentTarget: number;
  achievementsPerLevel: {
    GRADE_3: number;
    GRADE_4: number;
    GRADE_5: number;
  };
  burnDown: {
    GRADE_5: number[];
    GRADE_4: number[];
    GRADE_3: number[];
  };
}
