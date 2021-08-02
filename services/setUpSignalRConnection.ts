import * as signalR from "@microsoft/signalr";
import { HubConnection } from "@microsoft/signalr";
import getConfig from "next/config";
import { getAccessToken } from "../auth/msalHelpers";

/**
 * setUpSignalRConnection
 * Connects to a project-hub.
 * Use the returned connection to listen for changes etc...
 * @param projectId
 * @returns HubConnection
 */
export const setUpSignalRConnection = async (
  projectId: number
): Promise<HubConnection> => {
  const { publicRuntimeConfig } = getConfig();
  const connection = new signalR.HubConnectionBuilder()
    // .withUrl(publicRuntimeConfig.API_HUB_URL)
    .withUrl(publicRuntimeConfig.API_HUB_URL, {
      accessTokenFactory: () => getAccessToken(),
    })
    .withAutomaticReconnect()
    .build();

  connection
    .start()
    .then(() => {
      connection.invoke("SubscribeToVsm", projectId);
      connection
        .send("SendAsync", projectId.toString(), "onSaveProject", "")
        .then((r) => console.log("SendAsync", { r }))
        .catch((err) => console.error(err));

      connection.send("onSaveProject", "test");
      // SendAsync(string group,string action, string message)
    })
    .catch((err) => console.error(err));

  connection.onreconnecting((error) => {
    console.log("Trying to reconnect...", { error });
  });
  connection.onreconnected((s) => console.log("Reconnected!", s));
  connection.onclose((error) => console.log("Connection closed.", { error }));

  return connection;
};
