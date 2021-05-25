import { vsmObjectTypes } from "../../VsmObjectFactory/vsmObjectTypes";
import { vsmTaskTypes } from "../../VsmObjectFactory/GenericPostit/CreateSideContainer/vsmTaskTypes";
import { vsmObject } from "../../VsmObjectFactory/GenericPostit/CreateSideContainer/VsmObject";

export interface vsmProject {
  vsmProjectID: number;
  name: string;
  created: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
  lastUpdated: {
    pkChangeLog: number;
    userIdentity: string;
    changeDate: string;
    fkVsm: number;
    fkObject: vsmObjectTypes;
    fkTask: vsmTaskTypes;
  };
  objects: Array<vsmObject>;
}
