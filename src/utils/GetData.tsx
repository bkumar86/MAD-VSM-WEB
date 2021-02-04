import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { apiScopes } from "../config/authConfig";
import { sendRequest } from "./sendRequest";
import { tenantSpecificEndpoint } from "../pages/LoginPage";

export function getData(
  url: string,
  useAccount: AccountInfo,
  useInstance: IPublicClientApplication,
  callback: { (response: any): void; (arg0: any): void }
): void {
  if (useAccount) {
    useInstance
      .acquireTokenSilent({
        ...apiScopes,
        account: useAccount,
        authority: tenantSpecificEndpoint,
      })
      .then(({ accessToken }) => {
        sendRequest(accessToken, url).then((response) => {
          if (callback) {
            callback(response);
          }
        });
      });
  }
}
