// Config object to be passed to Msal on creation
export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AD_CLIENT_ID,
    authority: process.env.NEXT_PUBLIC_AD_AUTHORITY,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest = {
  scopes: [process.env.NEXT_PUBLIC_SCOPE],
};

export const APIConfigs = {
  url: process.env.NEXT_PUBLIC_API_BASEURL,
};
