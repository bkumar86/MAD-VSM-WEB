import React, { useEffect, useState } from "react";
import commonStyles from "../src/LayoutWrapper/common.module.scss";
import Head from "next/head";
import { Button, Icon, Tabs, Typography } from "@equinor/eds-core-react";
import { Layouts } from "../src/LayoutWrapper";
import { account_circle, add } from "@equinor/eds-icons";
import BaseAPIServices from "../src/box/ClickHandler/VSMCanvas/storeHooks/store/BaseAPIServices";
import { useRouter } from "next/router";
import styles from "./projects/Projects.module.scss";
import { projectTemplatesV1 } from "../src/projectTemplatesV1";
import { useAccount, useMsal } from "@azure/msal-react";
import { ProjectListSection } from "../src/projectListSection";

const { TabList, Tab, TabPanels, TabPanel } = Tabs;

Icon.add({ account_circle, add });

// eslint-disable-next-line max-lines-per-function
export default function Projects(): JSX.Element {
  const [projects, setProjects] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setFetching(true);
    BaseAPIServices.get("/api/v1.0/project")
      .then((value) => setProjects(value.data))
      .catch((reason) => {
        setError(reason);
      })
      .finally(() => setFetching(false));
  }, []);

  function createNewVSM() {
    setFetching(true);
    BaseAPIServices.post("/api/v1.0/project", projectTemplatesV1.defaultProject)
      .then((value) => router.push(`/projects/${value.data.vsmProjectID}`))
      .catch((reason) => setError(reason))
      .finally(() => setFetching(false));
  }

  if (error)
    return (
      <div className={commonStyles.container}>
        <Head>
          <title>Flyt | Projects</title>
          <link rel="icon" href={"/favicon.ico"} />
        </Head>

        <main className={commonStyles.main}>
          <Typography variant={"h2"}>{`Couldn't fetch projects`}</Typography>
          <Typography variant={"h3"}>{error.toString()}</Typography>
        </main>
      </div>
    );

  const projectsICanEdit = projects.filter(
    (p) => p.created.userIdentity !== account?.username.split("@")[0]
  );
  const projectsICanView = projects.filter(
    (p) => p.created.userIdentity === account?.username.split("@")[0]
  );
  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Flyt | Projects</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={commonStyles.main}>
        <div className={styles.header}>
          <Typography variant={"h1"}>My Value Stream Maps</Typography>
          <Button variant={"outlined"} onClick={() => createNewVSM()}>
            Create new VSM
            <Icon name="add" title="add" />
          </Button>
        </div>
        <>
          {!!fetching ? (
            <Typography variant={"h2"}>Fetching projects... </Typography>
          ) : (
            <>
              <Tabs
                activeTab={activeTab}
                onChange={(index) => setActiveTab(index)}
              >
                <TabList
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Tab>Edit</Tab>
                  <Tab>View</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      These are the VSMs you can edit
                    </p>
                    <ProjectListSection projects={projectsICanView} />
                  </TabPanel>
                  <TabPanel>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      These are the VSMs you can view.
                    </p>
                    <p
                      style={{
                        paddingBottom: 12,
                        display: "flex",
                        justifyContent: "center",
                        fontStyle: "italic",
                      }}
                    >
                      Currently you can only edit VSMs that you have created.
                    </p>
                    <ProjectListSection projects={projectsICanEdit} />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </>
          )}
        </>
      </main>
    </div>
  );
}

Projects.layout = Layouts.Default;
Projects.auth = true;
