import { User } from "./User";

export interface HelpRequest {
  id: string;
  requestTime: "string";
  pickupTime: "string" | null;
  reportTime: "string" | null;
  submitters: User[];
  helper: User | null;
  message: string | null;
  status: string;
  zoomRoom: string | null;
  zoomPassword: string | null;
  physicalRoom: string | null;
}
