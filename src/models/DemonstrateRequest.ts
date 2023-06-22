import { AchievementsResponse } from "./AchievementsResponse";
import { User } from "./User";

export interface DemonstrateRequest {
  id: string;
  requestTime: "string";
  pickupTime: "string" | null;
  reportTime: "string" | null;
  submitters: User[];
  examiner: User | null;
  achievements: AchievementsResponse[];
  status: string;
  zoomRoom: string | null;
  zoomPassword: string | null;
  physicalRoom: string | null;
}
