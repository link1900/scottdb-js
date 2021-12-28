import { mockApiFunctionBuilder } from "@link1900/node-test-util";
import {
  findOrLoadOAuthToken,
  generateOAuthToken,
  isOAuthTokenExpired,
  OAUTH_TOKEN_STORAGE,
  wrapOAuthTokenInExpiry,
} from "../oauthHelper";
import { OAuthRequest } from "../types/OAuthRequest";

const EXAMPLE_OAUTH_ENDPOINT =
  "https://dev-originenergy.au.auth0.com/oauth/token";
const EXAMPLE_OAUTH_TOKEN_NAME = "example_token";
const EXAMPLE_OAUTH_REQUEST = {
  client_id: "example_client_id",
  client_secret: "example_client_secret",
  audience: "https://read-user-api",
  grant_type: "client_credentials",
};

const mockOAuthEndpoint = mockApiFunctionBuilder({
  baseUrl: "https://dev-originenergy.au.auth0.com",
  path: "/oauth/token",
  method: "POST",
  status: 200,
  body: {
    access_token: "oauth_jwt_token",
    scope: "read:users",
    expires_in: 86400,
    token_type: "Bearer",
  },
});

describe("generateOAuthToken()", () => {
  it("call the oauth endpoint correctly", async () => {
    const apiMock = mockOAuthEndpoint();
    const oAuthRequest: OAuthRequest = EXAMPLE_OAUTH_REQUEST;
    const result = await generateOAuthToken(
      EXAMPLE_OAUTH_ENDPOINT,
      oAuthRequest
    );
    expect(result).toEqual({
      access_token: "oauth_jwt_token",
      expires_in: 86400,
      scope: "read:users",
      token_type: "Bearer",
    });
    expect(apiMock.isDone()).toBeTruthy();
    //@ts-ignore
    expect(apiMock?.requestHeaders["content-type"]).toEqual([
      "application/x-www-form-urlencoded",
    ]);
  });
});

describe("wrapOAuthTokenInExpiry()", () => {
  beforeEach(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementationOnce(() =>
        new Date("2020-05-27T15:00:00.000Z").valueOf()
      );
  });

  it("wraps with the token in the correct expiry", () => {
    const result = wrapOAuthTokenInExpiry({
      access_token: "oauth_jwt_token",
      expires_in: 86400,
      scope: "read:users",
      token_type: "Bearer",
    });
    expect(result).toEqual({
      expiresAt: "2020-05-28T14:55:00.000Z",
      issuedAt: "2020-05-27T15:00:00.000Z",
      token: {
        access_token: "oauth_jwt_token",
        expires_in: 86400,
        scope: "read:users",
        token_type: "Bearer",
      },
    });
  });

  it("wraps sets it to expiry immediately when passed a expires_in 0", () => {
    const result = wrapOAuthTokenInExpiry({
      access_token: "oauth_jwt_token",
      expires_in: 0,
      scope: "read:users",
      token_type: "Bearer",
    });
    expect(result).toEqual({
      expiresAt: "2020-05-27T15:00:00.000Z",
      issuedAt: "2020-05-27T15:00:00.000Z",
      token: {
        access_token: "oauth_jwt_token",
        expires_in: 0,
        scope: "read:users",
        token_type: "Bearer",
      },
    });
  });
});

describe("isOAuthTokenExpired()", () => {
  beforeAll(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2020-05-27T15:00:00.000Z").valueOf());
  });

  afterAll(() => {
    jest.spyOn(global.Date, "now").mockRestore();
  });

  it("returns true when token has an expiry in the past", () => {
    expect(
      isOAuthTokenExpired({
        expiresAt: "2020-05-26T14:55:00.000Z",
        issuedAt: "2020-05-25T15:00:00.000Z",
        token: {
          access_token: "oauth_jwt_token",
          expires_in: 86400,
          scope: "read:users",
          token_type: "Bearer",
        },
      })
    ).toEqual(true);
  });

  it("returns false when token has a expiry in the future", () => {
    expect(
      isOAuthTokenExpired({
        expiresAt: "2020-05-28T14:55:00.000Z",
        issuedAt: "2020-05-26T15:00:00.000Z",
        token: {
          access_token: "oauth_jwt_token",
          expires_in: 86400,
          scope: "read:users",
          token_type: "Bearer",
        },
      })
    ).toEqual(false);
  });
});

describe("findOrLoadOAuthToken()", () => {
  beforeAll(() => {
    jest
      .spyOn(global.Date, "now")
      .mockImplementation(() => new Date("2020-05-27T15:00:00.000Z").valueOf());
  });

  beforeEach(() => {
    OAUTH_TOKEN_STORAGE.clear();
  });

  afterAll(() => {
    jest.spyOn(global.Date, "now").mockRestore();
  });

  it("gets token from api when no existing token type is found", async () => {
    const apiMock = mockOAuthEndpoint();
    const result = await findOrLoadOAuthToken(
      EXAMPLE_OAUTH_TOKEN_NAME,
      EXAMPLE_OAUTH_ENDPOINT,
      EXAMPLE_OAUTH_REQUEST
    );
    expect(result).toEqual({
      access_token: "oauth_jwt_token",
      expires_in: 86400,
      scope: "read:users",
      token_type: "Bearer",
    });
    expect(apiMock.isDone()).toBeTruthy();
  });

  it("gets token from token store when it is valid", async () => {
    OAUTH_TOKEN_STORAGE.set(EXAMPLE_OAUTH_TOKEN_NAME, {
      expiresAt: "2020-05-28T14:55:00.000Z",
      issuedAt: "2020-05-26T15:00:00.000Z",
      token: {
        access_token: "oauth_jwt_token",
        expires_in: 86400,
        scope: "read:users",
        token_type: "Bearer",
      },
    });

    const result = await findOrLoadOAuthToken(
      EXAMPLE_OAUTH_TOKEN_NAME,
      EXAMPLE_OAUTH_ENDPOINT,
      EXAMPLE_OAUTH_REQUEST
    );
    expect(result).toEqual({
      access_token: "oauth_jwt_token",
      expires_in: 86400,
      scope: "read:users",
      token_type: "Bearer",
    });
  });

  it("gets token from api when token store token is expired", async () => {
    const apiMock = mockOAuthEndpoint();
    OAUTH_TOKEN_STORAGE.set(EXAMPLE_OAUTH_TOKEN_NAME, {
      expiresAt: "2020-05-26T14:55:00.000Z",
      issuedAt: "2020-05-25T15:00:00.000Z",
      token: {
        access_token: "oauth_jwt_token",
        expires_in: 86400,
        scope: "read:users",
        token_type: "Bearer",
      },
    });
    const result = await findOrLoadOAuthToken(
      EXAMPLE_OAUTH_TOKEN_NAME,
      EXAMPLE_OAUTH_ENDPOINT,
      EXAMPLE_OAUTH_REQUEST
    );
    expect(result).toEqual({
      access_token: "oauth_jwt_token",
      expires_in: 86400,
      scope: "read:users",
      token_type: "Bearer",
    });
    expect(apiMock.isDone()).toBeTruthy();
  });
});
