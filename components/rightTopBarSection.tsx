import { Button, Icon, TopBar } from "@equinor/eds-core-react";
import styles from "../layouts/default.layout.module.scss";
import UserMenu from "./AppHeader/UserMenu";
import React from "react";
import { comment_important, info_circle } from "@equinor/eds-icons";
import { LinkIcon } from "./linkIcon";
import { useStoreDispatch } from "../hooks/storeHooks";
import { useRouter } from "next/router";

const icons = {
  comment_important,
  info_circle,
};

Icon.add(icons);

export function RightTopBarSection(props: {
  isAuthenticated: boolean;
}): JSX.Element {
  const dispatch = useStoreDispatch();
  const router = useRouter();
  const { id } = router.query;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <LinkIcon
        helpText="Open Wiki"
        iconName="info_circle"
        link="https://wiki.equinor.com/wiki/index.php/Flyt"
        style={{ marginRight: 8 }}
      />
      <LinkIcon
        helpText="Give feedback"
        iconName="comment_important"
        link="https://forms.office.com/Pages/ResponsePage.aspx?id=NaKkOuK21UiRlX_PBbRZsGXJ18p1yVhOjLvQbqMNiVBUQUQyVUFYMkZRVUZPUk5TWjBESERGMFVUTiQlQCN0PWcu"
        style={{ marginRight: 8 }}
      />
      <Button onClick={() => dispatch.fetchProject({ id })}>Refresh</Button>
      {props.isAuthenticated && (
        <div className={styles.userCircle}>
          <TopBar.Actions>
            <UserMenu />
          </TopBar.Actions>
        </div>
      )}
    </div>
  );
}
