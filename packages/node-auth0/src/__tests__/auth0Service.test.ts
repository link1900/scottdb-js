import {
  generateTestJwtToken,
  mockApi,
  MockApiOptions
} from "@link1900/node-test-util";
import { deleteAuth0User, getAuth0User } from "../auth0Service";

export function mockAuth0GetUserApi(
  userId: string,
  options?: Partial<MockApiOptions>
) {
  return mockApi({
    baseUrl: "https://auth0.example.com",
    path: `/api/v2/users/${userId}`,
    method: "GET",
    status: 200,
    body: {
      user_id: "example-user-id",
      email: "example@example.com",
      username: "example-user-name",
      name: "example-name",
      picture: ""
    },
    ...options
  });
}

export function mockGetAuth0ManagementToken(options?: Partial<MockApiOptions>) {
  return mockApi({
    baseUrl: "https://auth0.example.com",
    path: "/oauth/token",
    method: "POST",
    status: 200,
    body: {
      access_token: generateTestJwtToken()
    },
    ...options
  });
}

describe("getAuth0User()", () => {
  beforeAll(() => {
    process.env.AUTH0_MANAGEMENT_DOMAIN = "auth0.example.com";
    process.env.AUTH0_MANAGEMENT_CLIENT_ID = "example-client-id";
    process.env.AUTH0_MANAGEMENT_CLIENT_SECRET = "example-secret";
    process.env.AUTH0_MANAGEMENT_AUDIENCE = "example-audience";
    mockGetAuth0ManagementToken();
  });

  afterAll(() => {
    delete process.env.AUTH0_MANAGEMENT_DOMAIN;
    delete process.env.AUTH0_MANAGEMENT_CLIENT_ID;
    delete process.env.AUTH0_MANAGEMENT_CLIENT_SECRET;
    delete process.env.AUTH0_MANAGEMENT_AUDIENCE;
  });

  it("gets an auth0 user", async () => {
    const getUserMock = mockAuth0GetUserApi("123");
    const auth0User = await getAuth0User("123");
    expect(auth0User).toEqual({
      email: "example@example.com",
      name: "example-name",
      picture: "",
      user_id: "example-user-id",
      username: "example-user-name"
    });
    expect(getUserMock.isDone()).toEqual(true);
  });

  it("deletes an auth0 user", async () => {
    const getUserMock = mockAuth0GetUserApi("123", { method: "DELETE" });
    const auth0User = await deleteAuth0User("123");
    expect(auth0User).toEqual(true);
    expect(getUserMock.isDone()).toEqual(true);
  });
});
