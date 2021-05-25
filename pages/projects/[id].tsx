import {
  useStoreDispatch,
  useStoreState,
} from "../../src/box/ClickHandler/VSMCanvas/storeHooks";
import commonStyles from "../../src/LayoutWrapper/common.module.scss";
import Head from "next/head";
import { Typography } from "@equinor/eds-core-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Layouts } from "../../src/LayoutWrapper";
import { useStoreRehydrated } from "easy-peasy";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../../src/box/VSMCanvas"),
  { ssr: false }
);

export default function Project() {
  const router = useRouter();
  const { id } = router.query;

  const error = useStoreState((state) => state.errorProject);
  const dispatch = useStoreDispatch();
  const project = useStoreState((state) => state.project);
  const rehydrated = useStoreRehydrated();
  useEffect(() => {
    if (id) {
      dispatch.fetchProject({ id });
      dispatch.setSelectedObject(null);
    }
  }, [id]);

  if (!rehydrated) {
    //Ref: https://easy-peasy.now.sh/docs/api/use-store-rehydrated.html
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">Hydrating...</Typography>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Project {id}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant="h1">{error.message}</Typography>
          <p>
            We have some troubles with this VSM. Please try to refresh the page.
          </p>
        </main>
      </div>
    );
  }
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>{project?.name || `Flyt | Project ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <DynamicComponentWithNoSSR />
      </main>
    </div>
  );
}

Project.layout = Layouts.Canvas;
Project.auth = true;
