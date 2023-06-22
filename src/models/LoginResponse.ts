import { CourseResponse } from "./CourseResponse";
import { User } from "./User";
export interface LoginResponse {
  token: string;
  user: User;
  course: CourseResponse;
}
