export interface OAuthToken {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}