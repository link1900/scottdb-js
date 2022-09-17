import { getVariable } from "@link1900/node-environment";
import {
  makeValidJsonRequest,
  makeValidRequest
} from "@link1900/node-http-client";
import { tokenHasNotExpired } from "@link1900/node-jwt";
import { InternalServerError } from "@link1900/node-error";

const AUTH0_URLS = {
  BASE: "/api/v2",
  TOKEN: "/oauth/token",
  USERS: "/users",
  ROLES: "/roles"
};

let managementJwt: string | undefined = undefined;

export interface Auth0User {
  user_id?: string;
  email?: string;
  username?: string;
  name?: string;
  picture?: string;
}

export interface Auth0Role {
  id?: string;
  name?: string;
  description?: string;
}

export interface Auth0TokenResponse {
  access_token: string;
}

export async function getAuth0User(
  userId: string
): Promise<Auth0User | undefined> {
  return makeAuth0ManagementApiCall(`${AUTH0_URLS.USERS}/${userId}`);
}

export async function getAuth0UserRoles(
  userId: string
): Promise<Auth0Role[] | undefined> {
  return makeAuth0ManagementApiCall(
    `${AUTH0_URLS.USERS}/${userId}${AUTH0_URLS.ROLES}`
  );
}

export async function updateAuth0UserRoles(
  userId: string,
  role: string
): Promise<Auth0Role[] | undefined> {
  return makeAuth0ManagementApiCall(
    `${AUTH0_URLS.USERS}/${userId}${AUTH0_URLS.ROLES}`,
    "POST",
    { roles: [role] }
  );
}

export async function deleteAuth0User(userId: string) {
  return makeNoResponseAuth0ManagementApiCall(
    `${AUTH0_URLS.USERS}/${userId}`,
    "DELETE"
  );
}

export async function getAuth0Roles(): Promise<Auth0Role[] | undefined> {
  return makeAuth0ManagementApiCall(`${AUTH0_URLS.ROLES}`);
}

export function getAuth0ManagementUrl(featureUrl: string) {
  const auth0Domain = getVariable("AUTH0_MANAGEMENT_DOMAIN");
  return `https://${auth0Domain}${AUTH0_URLS.BASE}${featureUrl}`;
}

export async function getHeadersForAuth0ManagementApi() {
  const token = await getManagementJwt();
  const bearer = `Bearer ${token}`;
  return { Authorization: bearer };
}

export async function makeAuth0ManagementApiCall<T>(
  featureUrl: string,
  method: string = "GET",
  body?: Object
): Promise<T> {
  const url = getAuth0ManagementUrl(featureUrl);
  const headers = await getHeadersForAuth0ManagementApi();
  return await makeValidJsonRequest<T>({
    url,
    method,
    headers,
    body
  });
}

export async function makeNoResponseAuth0ManagementApiCall<T>(
  featureUrl: string,
  method: string = "GET",
  providedBody?: object
): Promise<boolean> {
  const url = getAuth0ManagementUrl(featureUrl);
  const headers = await getHeadersForAuth0ManagementApi();
  const body = providedBody ? JSON.stringify(providedBody) : "";
  const result = await makeValidRequest({
    url,
    method,
    headers,
    body
  });
  return result.ok;
}

export async function getManagementJwt() {
  if (!managementJwt || !tokenHasNotExpired(managementJwt)) {
    managementJwt = await getNewManagementJwt();
  }

  return managementJwt;
}

export async function getNewManagementJwt(): Promise<string> {
  const auth0Domain = getVariable("AUTH0_MANAGEMENT_DOMAIN");
  const url = `https://${auth0Domain}${AUTH0_URLS.TOKEN}`;
  const options = {
    url,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      grant_type: "client_credentials",
      client_id: getVariable("AUTH0_MANAGEMENT_CLIENT_ID"),
      client_secret: getVariable("AUTH0_MANAGEMENT_CLIENT_SECRET"),
      audience: getVariable("AUTH0_MANAGEMENT_AUDIENCE")
    }
  };
  const response = await makeValidJsonRequest<Auth0TokenResponse>(options);
  if (!response || !response.access_token) {
    throw new InternalServerError("Unable to get access token for auth0");
  }
  return response.access_token;
}
