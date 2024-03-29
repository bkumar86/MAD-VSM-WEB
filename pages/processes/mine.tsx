import React, { useState } from "react";
import styles from "./FrontPage.module.scss";
import Head from "next/head";
import { Layouts } from "../../layouts/LayoutWrapper";
import FrontPageBody from "components/FrontPageBody";
import SideNavBar from "components/SideNavBar";
import { useQuery } from "react-query";
import { getProjects, searchUser } from "../../services/projectApi";
import { getUserShortName } from "../../utils/getUserShortName";
import { useAccount, useMsal } from "@azure/msal-react";
import { useRouter } from "next/router";
import { Typography } from "@equinor/eds-core-react";
import { SortSelect } from "../../components/SortSelect";
import { SearchField } from "components/SearchField";
import FilterLabelButton from "components/Labels/FilterLabelButton";
import ActiveFilterSection from "components/Labels/ActiveFilterSection";

export default function MyProcesses(): JSX.Element {
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const router = useRouter();

  //Get my user
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const shortName = getUserShortName(account);

  const { data: users } = useQuery(["userName"], () => searchUser(shortName));
  const myUserId = users?.find((user) => user.userName === shortName)?.pkUser;

  const query = useQuery(
    ["myProjects", page, myUserId, ...Object.values(router.query)],
    () =>
      getProjects({
        page,
        ru: [myUserId],
        items: itemsPerPage,
        ...router.query,
      }),
    { enabled: !!myUserId }
  );

  // rl stands for "required label"
  const labelsID = router.query.rl ? `${router.query.rl}`.split(",") : null;

  return (
    <div>
      <Head>
        <title>Flyt | My processes</title>
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
              <Typography variant="h3">My processes</Typography>
              <div className={styles.sortAndFilter}>
                <FilterLabelButton />
                <SortSelect />
              </div>
            </div>
            {labelsID && (
              <div className={styles.subHeader}>
                <ActiveFilterSection labelIDArray={labelsID} />
              </div>
            )}
          </div>
          <FrontPageBody
            itemsPerPage={itemsPerPage}
            onChangePage={(pageNumber: number) => setPage(pageNumber)}
            query={query}
            showNewProjectButton={true}
          />
        </div>
      </main>
    </div>
  );
}

MyProcesses.layout = Layouts.Default;
MyProcesses.auth = true;
