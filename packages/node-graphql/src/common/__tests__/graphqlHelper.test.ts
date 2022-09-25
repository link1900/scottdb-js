import {
  documentNodeToString,
  getOperationNameFromGraphqlQueryString,
  logGraphqlCall,
} from "../graphqlHelper";
import gql from "graphql-tag";
import { logger } from "@link1900/node-logger-api";

const exampleQuery =
  "query ViewerLoadQuery {\n" +
  "  viewer {\n" +
  "    user {\n" +
  "      ...UserProfile\n" +
  "      __typename\n" +
  "    }\n" +
  "    __typename\n" +
  "  }\n" +
  "}\n" +
  "\n" +
  "fragment UserProfile on User {\n" +
  "  id\n" +
  "  name\n" +
  "  __typename\n" +
  "}\n";

describe("logGraphqlCall()", () => {
  it("logs the request correctly when body is an object", async () => {
    const loggerMock = jest.spyOn(logger, "info");
    const exampleBodyObject = {
      operationName: "ViewerLoadQuery",
      variables: {},
      query: exampleQuery,
    };
    const result = logGraphqlCall(exampleBodyObject);
    expect(result).toEqual(true);
    expect(loggerMock).toBeCalled();
    const expectedMeta = {
      operationName: "ViewerLoadQuery",
      query:
        "query ViewerLoadQuery { viewer { user { ...UserProfile __typename } __typename } } fragment UserProfile on User { id name __typename } ",
    };
    expect(loggerMock).toHaveBeenCalledWith(
      "processing graphql query",
      expectedMeta
    );
  });

  it("logs the request correctly when body is a string", async () => {
    const loggerMock = jest.spyOn(logger, "info");
    const exampleBody = `{"operationName":"UserProfileQuery","variables":{},"query":"query UserProfileQuery {\\n  viewer {\\n    user {\\n      ...UserProfile\\n      __typename\\n    }\\n    __typename\\n  }\\n}\\n\\nfragment UserProfile on User {\\n  id\\n  name\\n  role\\n  email\\n  imageUrl\\n  createdAt\\n  updatedAt\\n  __typename\\n}\\n"}`;
    const result = logGraphqlCall(exampleBody);
    expect(result).toEqual(true);
    expect(loggerMock).toBeCalled();
    const expectedMeta = {
      operationName: "UserProfileQuery",
      query:
        "query UserProfileQuery { viewer { user { ...UserProfile __typename } __typename } } fragment UserProfile on User { id name role email imageUrl createdAt updatedAt __typename } ",
    };
    expect(loggerMock).toHaveBeenCalledWith(
      "processing graphql query",
      expectedMeta
    );
  });
});

describe("getOperationNameFromGraphqlQueryString()", () => {
  it("gets the name correctly", () => {
    const result = getOperationNameFromGraphqlQueryString(exampleQuery);
    expect(result).toEqual("ViewerLoadQuery");
  });

  it("return empty string when undefined", () => {
    const result = getOperationNameFromGraphqlQueryString(undefined);
    expect(result).toEqual("");
  });

  it("return only the first name", () => {
    const result = getOperationNameFromGraphqlQueryString("query many names");
    expect(result).toEqual("many");
  });

  it("return empty string when null", () => {
    const result = getOperationNameFromGraphqlQueryString(null);
    expect(result).toEqual("");
  });

  it("return empty string when string is empty", () => {
    const result = getOperationNameFromGraphqlQueryString("");
    expect(result).toEqual("");
  });

  it("return empty string when no query is defined", () => {
    const result = getOperationNameFromGraphqlQueryString("some words");
    expect(result).toEqual("");
  });

  it("return empty string when query has no name", () => {
    const result = getOperationNameFromGraphqlQueryString(
      "query { viewer { user { __typename } } }"
    );
    expect(result).toEqual("");
  });

  it("return empty string when query no body", () => {
    const result = getOperationNameFromGraphqlQueryString("query");
    expect(result).toEqual("");
  });
});

describe("documentNodeToString()", () => {
  it("gets the document node correctly", () => {
    const result = documentNodeToString(gql(exampleQuery));
    expect(result).toEqual(exampleQuery);
  });
});
