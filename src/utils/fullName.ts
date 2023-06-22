import { User } from "../models/User"

export const fullName = (user?: User | null) => {
  if (user === undefined || user === null) return ""
  return user?.firstName + " " +  user?.lastName
}
