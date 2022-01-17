import React, { useState } from "react";

import ActiveFilterSection from "components/Labels/ActiveFilterSection";
import FilterLabelButton from "components/Labels/FilterLabelButton";
import FilterUserButton from "components/FilterUserButton";
import FrontPageBody from "components/FrontPageBody";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import { SearchField } from "components/SearchField";
import SideNavBar from "components/SideNavBar";
import { SortSelect } from "../../components/SortSelect";
import { Typography } from "@equinor/eds-core-react";
import { getProjects } from "../../services/projectApi";
import styles from "./FrontPage.module.scss";
import { useQuery } from "react-query";
import { useRouter } from "next/router";

export default function AllProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();
  const requiredUsers = router.query?.user
    ?.toString()
    .split(",")
    .map((user) => parseInt(user));
  const requiredLabels = router.query?.rl
    ?.toString()
    .split(",")
    .map((label) => parseInt(label));
  const query = useQuery(
    ["projects", page, ...Object.values(router.query)],
    () =>
      getProjects({
        page,
        items: itemsPerPage,
        ru: requiredUsers ? [...requiredUsers] : [],
        rl: requiredLabels ? [...requiredLabels] : [],
      })
  );

  return (
    <div>
      <Head>
        <title>Flyt | All processes</title>
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>

      <main className={styles.main}>
        <SideNavBar />
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.subHeader}>
              <SearchField />
            </div>
            <div className={styles.subHeader}>
              <Typography variant="h3">All processes</Typography>
              <div className={styles.sortAndFilter}>
                <FilterUserButton />
                <FilterLabelButton />
                <SortSelect />
              </div>
            </div>
            <div className={styles.subHeader}>
              <ActiveFilterSection />
            </div>
          </div>
          <FrontPageBody
            showNewProjectButton={true}
            itemsPerPage={itemsPerPage}
            query={query}
            onChangePage={(newPage) => setPage(newPage)}
          />
        </div>
      </main>
    </div>
  );
}

AllProcesses.layout = Layouts.Default;
AllProcesses.auth = true;
