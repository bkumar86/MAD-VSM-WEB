import signalR, {
  HubConnection,
  HubConnectionBuilder,
} from "@microsoft/signalr";
import getConfig from "next/config";

export class SignalRService {
  private readonly _connection: signalR.HubConnection;

  constructor(
    projectId: number,
    changeHandlers: {
      onSaveProject;
      onDeleteProject;
      onUpdateObject;
      onDeleteObject;
      onSaveTask;
      onDeleteTask;
    }
  ) {
    const { publicRuntimeConfig } = getConfig();
    this._connection = new HubConnectionBuilder()
      .withUrl(`${publicRuntimeConfig.API_HUB_URL}`)
      .withAutomaticReconnect()
      .build();

    console.log("Starting connection");
    this._connection
      .start()
      .then(() =>
        this._connection
          .invoke("SubscribeToVsm", projectId)
          .then((r) => {
            console.log("invocation response", r);
            this.sendMessage("TEST", projectId);
            this.sendMessage("SaveProject", projectId);
            this.sendMessage("DeleteProject", projectId);
            this.sendMessage("UpdateObject", projectId);
            this.sendMessage("DeletedObject", projectId);
            this.sendMessage("SaveTask", projectId);
            this.sendMessage("DeleteTask", projectId);
          })
          .catch((e) => {
            console.error(e);
          })
      )
      .catch((err) => {
        console.error(err);
      });

    //todo: Make it work. It's not triggering on any updates...
    this.connection.on("SaveProject", (data) => {
      changeHandlers.onSaveProject(data);
    });

    this.connection.on("DeleteProject", (data) => {
      changeHandlers.onDeleteProject(data);
    });

    this.connection.on("UpdateObject", (data) => {
      changeHandlers.onUpdateObject(data);
    });

    this.connection.on("DeletedObject", (data) => {
      changeHandlers.onDeleteObject(data);
    });

    this.connection.on("SaveTask", (data) => {
      changeHandlers.onSaveTask(data);
    });

    this.connection.on("DeleteTask", (data) => {
      changeHandlers.onDeleteTask(data);
    });

    this.connection.onreconnecting((error) => {
      console.log("SignalR | Trying to reconnect...", { error });
    });

    this.connection.onreconnected((s) => {
      console.log("SignalR | Reconnected!", s);
    });

    this.connection.onclose((error) => {
      console.log("SignalR | Connection closed.", { error });
    });
  }

  private sendMessage(methodName: string, projectId: number) {
    setInterval(() => {
      //"SendAsync", projectId.toString(), "onSaveProject", "")
      this.connection
        .invoke("SendAsync", projectId.toString(), methodName, "")
        .then((r) => console.log(`${methodName} invoked`, r))
        .catch((err) => console.error(err));

      this.connection
        .send(methodName, projectId.toString(), "test")
        .then((r) => console.log(`${methodName} sent`, r))
        .catch((err) => console.error(err));
    }, 10000);
  }

  get connection(): HubConnection {
    return this._connection;
  }

  disconnect = (): void => {
    if (this?._connection) {
      this._connection.stop().then((r) => console.log(r));
    }
  };
}
