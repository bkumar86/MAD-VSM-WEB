import { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { apiScopes } from "../config/authConfig";
import { tenantSpecificEndpoint } from "../pages/LoginPage";
import { sendRequest } from "./sendRequest";

export function postData(
  url: string,
  payload: unknown,
  useAccount: AccountInfo | null,
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
        sendRequest(accessToken, url, "POST", payload).then((response) => {
          if (callback) {
            callback(response);
          }
        });
      });
  }
}
