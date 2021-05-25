import { vsmObjectTypes } from "../../VsmObjectFactory/vsmObjectTypes";
import { vsmObject } from "../../VsmObjectFactory/GenericPostit/CreateSideContainer/VsmObject";

export const canDeleteVSMObject = (vsmObject: vsmObject): boolean => {
  if (!vsmObject) return false;
  const { pkObjectType } = vsmObject.vsmObjectType;
  return (
    pkObjectType === vsmObjectTypes.mainActivity ||
    pkObjectType === vsmObjectTypes.subActivity ||
    pkObjectType === vsmObjectTypes.waiting ||
    pkObjectType === vsmObjectTypes.choice
  );
};
