// @ts-nocheck

import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from '../Config';

const msalInstance = new PublicClientApplication(msalConfig);
export default msalInstance;

export async function getAccessToken() {
  try {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      account: await msalInstance.getActiveAccount(),
      scopes: loginRequest.scopes,
      authority: `${process.env.NEXT_PUBLIC_AD_AUTHORITY}`,
    });
    return `Bearer ${tokenResponse.accessToken}`;
  } catch (e) {
    throw new Error(e);
  }
}
