import getApiBaseUrl from "./getApiBaseUrl";

export async function sendRequest(
  accessToken: string,
  url: string,
  method = "GET",
  payload?: unknown
): Promise<any> {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);
  headers.append("Content-Type", "application/json");

  return fetch(getApiBaseUrl() + url, {
    method,
    headers,
    body: JSON.stringify(payload) ?? null,
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
