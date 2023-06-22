import { User } from "./../../models/User";

export const sortSubmitters = (a: User, b: User) =>
  (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
