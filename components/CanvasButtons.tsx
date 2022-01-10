import React from "react";
import { CategorizationPageButton } from "./CategorizationPageButton";
import styles from "./CanvasButtons.module.scss";
import { ManageLabelButton } from "./Labels/ManageLabelButton";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const CanvasButtons = (props: {
  userCanEdit: boolean;
  handleClickLabel: () => void;
}): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      {props.userCanEdit && (
        <ManageLabelButton handleClickLabel={props.handleClickLabel} />
      )}
      <CategorizationPageButton />
    </div>
  );
};
