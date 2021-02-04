import React, { useEffect, useState } from "react";
import { AppTopBar, VSMCanvas } from "../components";
import { useLocation } from "react-router";
import { AccountInfo } from "@azure/msal-browser";
import { useAccount, useMsal } from "@azure/msal-react";
import { getData } from "../utils/GetData";

export function VSMPage(): JSX.Element {
  const location = useLocation();
  const [project, setProject] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [VSMData, setVSMData] = useState({});

  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    const project = new URLSearchParams(location.search).get("project");
    if (project) setProject(project);
    // Should we set current project here then? Then fetch
  }, [location]);

  function fetchProject() {
    if (project) {
      setLoading(true);
      getData(
        `/api/v1.0/project/${project}`,
        account as AccountInfo,
        instance,
        (response: React.SetStateAction<never[]>) => {
          setVSMData(response);
          setLoading(false);
        }
      );
    }
  }

  useEffect(() => {
    //Only trigger if we have a project
    fetchProject();
  }, [account, project]);

  console.log(VSMData);
  return (
    <div>
      <AppTopBar style={{ position: "fixed", width: "100%" }} />
      <VSMCanvas data={VSMData} refreshProject={() => fetchProject()} />
    </div>
  );
}
