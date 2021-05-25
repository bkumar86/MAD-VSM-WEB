import React, { useState } from "react";
import { taskObject } from "../VsmObjectFactory/GenericPostit/CreateSideContainer/taskObject";
import { useStoreState } from "../storeHooks";
import { SideBarHeader } from "./SideBarContent/SideBarHeader";
import { NewTaskSection } from "./SideBarContent/NewTaskSection";
import { SideBarBody } from "./SideBarContent/SideBarBody";

/**
 * Process specific content stuff
 * @param props
 * @constructor
 */
export function SideBarContent(props: {
  onChangeName: (event: { target: { value: string } }) => void;
  onChangeRole: (event: { target: { value: string } }) => void;
  onChangeTime: (event: { target: { value: string } }) => void;
  onChangeTimeDefinition: (timeDefinition: string) => void;
  onAddTask: (task: taskObject) => void;
  onClose: () => void;
  onDelete: () => void;
  canEdit: boolean;
}): JSX.Element {
  const selectedObject = useStoreState((state) => state.selectedObject);
  const [showNewTaskSection, setShowNewTaskSection] = useState(false);

  if (showNewTaskSection)
    return <NewTaskSection onClose={() => setShowNewTaskSection(false)} />;

  return (
    <React.Fragment key={selectedObject.vsmObjectID}>
      <SideBarHeader
        object={selectedObject}
        onClose={props.onClose}
        onDelete={props.onDelete}
        canEdit={props.canEdit}
      />
      <SideBarBody
        selectedObject={selectedObject}
        onChangeRole={props.onChangeRole}
        onChangeName={props.onChangeName}
        onChangeTimeDefinition={props.onChangeTimeDefinition}
        onChangeTime={props.onChangeTime}
        setShowNewTaskSection={setShowNewTaskSection}
        canEdit={props.canEdit}
      />
    </React.Fragment>
  );
}
