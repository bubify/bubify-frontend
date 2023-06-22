import { User } from "../models/User"

export const nameInitials = (user?: User | null) => {
  if (user === undefined || user === null) return ""
  return user?.firstName[0] + user?.lastName[0]
}
