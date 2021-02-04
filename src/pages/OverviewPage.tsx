import React, { useEffect, useState } from "react";
import moment from "moment";
import { AccountInfo } from "@azure/msal-browser";
import { AppTopBar } from "../components";
import { AuthenticatedTemplate, useAccount, useMsal } from "@azure/msal-react";
import { Button, Icon } from "@equinor/eds-core-react";
import { VSMCard } from "../components/VSMCard";
import { apiScopes } from "../config/authConfig";
import { simpleProcess } from "../utils/processSamples";
import { tenantSpecificEndpoint } from "./LoginPage";
import { useHistory } from "react-router-dom";
import { getData } from "../utils/GetData";
import { postData } from "../utils/PostData";

interface VSMInterface {
  vsmProjectID: number;
  name: string;
  created: string;
  updated: string;
}

function hideWhenNotLoading(loading: boolean | undefined) {
  if (loading) return "";
  return "hidden";
}

function LoadingIndicator(props: { isLoading: boolean }) {
  const { isLoading } = props;
  return (
    <span className={`${hideWhenNotLoading(isLoading)} loading noselect`}>
      Loading...
    </span>
  );
}

export const getSilentRequest = (account: AccountInfo) => {
  return {
    ...apiScopes,
    account: account,
    authority: tenantSpecificEndpoint,
  };
};

export function OverviewPage(): JSX.Element {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [VSMData, setVSMData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    getData(
      "/api/v1.0/project",
      account as AccountInfo,
      instance,
      (response: any) => {
        setVSMData(response);
        setLoading(false);
      }
    );
  }, [account]);

  function createNewVSM(
    history:
      | import("history").History<unknown>
      | { pathname: string; search: string }[]
  ) {
    setLoading(true);
    postData(
      `/api/v1.0/project`,
      simpleProcess,
      account,
      instance,
      (response: { vsmProjectID: any }) => {
        setLoading(false);
        const { vsmProjectID } = response;
        if (vsmProjectID) {
          history.push({
            pathname: "/vsm",
            search: `project=${vsmProjectID}`,
          });
        }
      }
    );
  }

  return (
    <>
      <AppTopBar />
      <div className={"appear"} style={{ padding: 24 }}>
        <AuthenticatedTemplate>
          <div
            className="noselect"
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent:
                window.innerWidth > 550 ? "space-between" : "space-around",
              paddingBottom: 24,
            }}
          >
            <h1>My Value Stream Maps</h1>
            <Button variant={"outlined"} onClick={() => createNewVSM(history)}>
              Create new VSM
              <Icon name="add" title="add" size={16} />
            </Button>
          </div>
          <>
            <LoadingIndicator isLoading={isLoading} />
            {!isLoading && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: window.innerWidth > 550 ? "unset" : "center",
                }}
              >
                {VSMData?.length > 0 ? (
                  VSMData.sort((a: VSMInterface, b: VSMInterface) => {
                    if (moment(a.updated).isBefore(moment(b.updated))) return 1;
                    return -1;
                  }).map((vsm: VSMInterface) => (
                    <VSMCard key={vsm.vsmProjectID} vsm={vsm} />
                  ))
                ) : (
                  <p className={"appear"}>Could not find any VSMs</p>
                )}
              </div>
            )}
          </>
        </AuthenticatedTemplate>
      </div>
    </>
  );
}
