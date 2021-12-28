# `@link1900/node-oauth`

> Node oauth

## Install

Using npm:

```sh
npm install @link1900/node-oauth
```

or using yarn:

```sh
yarn add @link1900/node-oauth
```

## Usage

Example for getting a Machine to Machine oauth token from Origin auth0 service.

```typescript
  const oAuthRequest: OAuthRequest = {
    client_id: "AUTH0_CLIENT_ID",
    client_secret: "AUTH0_CLIENT_SECRET",
    audience: "https://read-user-api",
    grant_type: "client_credentials",
  };
  const auth0Endpoint = "AUTH0_OAUTH_ENDPOINT";
  return findOrLoadOAuthToken("token_type", auth0Endpoint, oAuthRequest);
```
