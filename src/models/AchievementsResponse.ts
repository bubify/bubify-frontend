export interface AchievementsResponse {
  id: string;
  code: string;
  name: string;
  urlToDescription: string;
  level: string;
  isClassicalAchievement: boolean;
  currentlyPushedBack: boolean;
  unlocked: boolean;
  achievementType: string;
}

type code = string;
type name = string;
export type Achievements = Map<code, name>;
