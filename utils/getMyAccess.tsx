import { getUserShortName } from "./getUserShortName";
import { vsmProject } from "../interfaces/VsmProject";

/**
 * Get my access in a project
 * @param project
 * @param account
 * @returns {string} access
 */
export function getMyAccess(
  project: vsmProject,
  account: { username: string }
): "Owner" | "Admin" | "Contributor" | "Reader" {
  //Default to "Reader"
  if (!project || !account) return "Reader";

  const shortName = getUserShortName(account);
  // Find our role
  const role = project.userAccesses.find(
    (access) => access.user === shortName
  )?.role;

  //If not given a role, we default to "Reader"
  return role || "Reader";
}
