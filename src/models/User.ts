export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  role: string;
  gitHubRepoURL: string;
  gitHubHandle: string | null;
  zoomRoom: string | null;
  needsZoomLink: boolean;
  needsProfilePic: boolean;
  profilePic: string | null;
  verifiedProfilePic: boolean;
  lastLogin: null | string;
  deadline: null | string;
  canClaimHelpRequests: boolean;
}
