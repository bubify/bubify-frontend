import { AchievementsResponse } from "./../../models/AchievementsResponse";

export type AchievementCode = string;
export type AchievementInfo = {
  id: string;
  name: string;
  urlToDescription: string;
  level: string;
};
export type AchievementLookup = Map<AchievementCode, AchievementInfo>;

export async function buildAchievementLookup(data: AchievementsResponse[]) {
  const achievementLookup: AchievementLookup = new Map();
  data.forEach((e) => {
    achievementLookup.set(e.code, {
      id: e.id,
      name: e.name,
      urlToDescription: e.urlToDescription,
      level: e.level,
    });
  });
  return data;
}
