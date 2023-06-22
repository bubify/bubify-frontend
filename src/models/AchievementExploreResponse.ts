import { User } from "./User";
export interface AchievementExploreResponse {
  remaining: User[];
  unlocked: User[];
  struggling: User[];
}
