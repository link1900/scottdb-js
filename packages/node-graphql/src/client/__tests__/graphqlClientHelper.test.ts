import gql from "graphql-tag";
import { mockGraphqlApi } from "@link1900/node-test-util";
import {
  makeValidGraphqlQuery,
  makeValidGraphqlRequest,
} from "../graphqlClientHelper";

const EXAMPLE_URL = "http://localhost/graphql";

const EXAMPLE_QUERY_NODE = gql`
  query {
    viewer {
      user {
        id
      }
    }
  }
`;

const EXAMPLE_QUERY_STRING = "query { viewer { id } }";

describe("makeValidGraphqlRequest()", () => {
  it("makes the request correctly", async () => {
    const expectedResponse = { viewer: { id: "21" } };
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: expectedResponse,
    });
    const result = await makeValidGraphqlRequest({
      url: EXAMPLE_URL,
      query: EXAMPLE_QUERY_STRING,
    });
    expect(result).toEqual({ data: expectedResponse });
    expect(apiMock.isDone()).toEqual(true);
  });

  it("makes the mutation request correctly", async () => {
    const expectedResponse = { viewer: { id: "21" } };
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: expectedResponse,
    });
    const result = await makeValidGraphqlRequest({
      url: EXAMPLE_URL,
      query:
        "mutation($input: UpdatePayload!) { createUser(input: $input) { id } }",
      variables: { input: { name: "someName" } },
    });
    expect(result).toEqual({ data: expectedResponse });
    expect(apiMock.isDone()).toEqual(true);
  });

  it("can define a custom method", async () => {
    const expectedResponse = { viewer: { id: "21" } };
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      method: "PUT",
      data: expectedResponse,
    });
    const result = await makeValidGraphqlRequest({
      url: EXAMPLE_URL,
      method: "PUT",
      query: EXAMPLE_QUERY_STRING,
    });
    expect(result).toEqual({ data: expectedResponse });
    expect(apiMock.isDone()).toEqual(true);
  });
});

describe("makeValidGraphqlQuery()", () => {
  it("executes the request correct with query string correctly", async () => {
    const expectedResponse = { viewer: { id: "21" } };
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: expectedResponse,
    });
    const result = await makeValidGraphqlQuery({
      url: EXAMPLE_URL,
      query: EXAMPLE_QUERY_STRING,
    });
    expect(result).toEqual(expectedResponse);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("executes the request correct with query node correctly", async () => {
    const expectedResponse = { viewer: { id: "21" } };
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      data: expectedResponse,
    });
    const result = await makeValidGraphqlQuery({
      url: EXAMPLE_URL,
      query: EXAMPLE_QUERY_NODE,
    });
    expect(result).toEqual(expectedResponse);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("throws an error if api returns errors", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      errors: [{ message: "something went wrong" }],
    });
    await expect(
      makeValidGraphqlQuery({ url: EXAMPLE_URL, query: EXAMPLE_QUERY_NODE })
    ).rejects.toThrowError("graphql api returned errors");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("throws an error if api returns no data", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
    });
    await expect(
      makeValidGraphqlQuery({ url: EXAMPLE_URL, query: EXAMPLE_QUERY_NODE })
    ).rejects.toThrowError("graphql api returned response without data");
    expect(apiMock.isDone()).toEqual(true);
  });

  it("throws an error if api returns empty errors", async () => {
    const apiMock = mockGraphqlApi({
      baseUrl: "http://localhost",
      path: "/graphql",
      errors: [null as any, {}],
    });
    await expect(
      makeValidGraphqlQuery({ url: EXAMPLE_URL, query: EXAMPLE_QUERY_NODE })
    ).rejects.toThrowError("graphql api returned errors");
    expect(apiMock.isDone()).toEqual(true);
  });
});
