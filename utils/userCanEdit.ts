export const userCanEdit = (myAccess: string): boolean =>
  myAccess === "Owner" || myAccess === "Admin" || myAccess === "Contributor";
