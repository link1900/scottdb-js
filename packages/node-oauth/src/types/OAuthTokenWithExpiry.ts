import { OAuthToken } from "./OAuthToken";

export interface OAuthTokenWithExpiry {
  token: OAuthToken;
  issuedAt: string; // the date time the token as was issued in ISO-8601 UTC
  expiresAt: string; // the date time the token will no longer be valid in ISO-8601 UTC
}
