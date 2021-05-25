import { vsmProject } from "./storeHooks/store/VsmProject";

export function getUserCanEdit(
  account: {
    username: string;
  },
  project: vsmProject
): boolean {
  const userName = account?.username.split("@")[0];
  return project?.created.userIdentity === userName;
}
