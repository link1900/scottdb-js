import { URLSearchParams } from "url";
import moment from "moment-timezone";
import { makeValidRequest } from "@link1900/node-http-client";
import { OAuthToken } from "./types/OAuthToken";
import { OAuthRequest } from "./types/OAuthRequest";
import { OAuthTokenWithExpiry } from "./types/OAuthTokenWithExpiry";

export const OAUTH_TOKEN_STORAGE = new Map<string, OAuthTokenWithExpiry>();
const OAUTH_EXPIRY_BUFFER = 300;

export async function generateOAuthToken(
  oauthEndpoint: string,
  oauthRequest: OAuthRequest
): Promise<OAuthToken> {
  const response = await makeValidRequest({
    url: oauthEndpoint,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: oauthRequest.client_id,
      client_secret: oauthRequest.client_secret,
      audience: oauthRequest.audience,
      grant_type: oauthRequest.grant_type,
    }),
  });
  return response.json();
}

export function wrapOAuthTokenInExpiry(
  token: OAuthToken
): OAuthTokenWithExpiry {
  const now = moment();
  const expireSeconds = Math.max(token.expires_in - OAUTH_EXPIRY_BUFFER, 0);
  const expireDate = now.clone().add(expireSeconds, "seconds");
  return {
    token,
    issuedAt: now.toISOString(),
    expiresAt: expireDate.toISOString(),
  };
}

export function isOAuthTokenExpired(oauthToken: OAuthTokenWithExpiry): boolean {
  return moment(oauthToken.expiresAt).isBefore(moment());
}

export async function findOrLoadOAuthToken(
  type: string,
  oauthEndpoint: string,
  oauthRequest: OAuthRequest
): Promise<OAuthToken> {
  const foundTokenWrapper = OAUTH_TOKEN_STORAGE.get(type);
  if (foundTokenWrapper && !isOAuthTokenExpired(foundTokenWrapper)) {
    return foundTokenWrapper.token;
  }
  const loadedToken = await generateOAuthToken(oauthEndpoint, oauthRequest);
  const wrappedToken = wrapOAuthTokenInExpiry(loadedToken);
  OAUTH_TOKEN_STORAGE.set(type, wrappedToken);
  return loadedToken;
}
