import {
  getCacheControlContextFromHeaders,
  getIdTokenFromAuthorizationHeader,
} from "../headerHelper";

describe("getIdTokenFromAuthorizationHeader()", () => {
  it("gets the token from http headers for authorization", () => {
    const tokenId = getIdTokenFromAuthorizationHeader("Bearer someToken");
    expect(tokenId).toEqual("someToken");
  });

  it("gets the token from http headers for Authorization", () => {
    const tokenId = getIdTokenFromAuthorizationHeader("Bearer someToken");
    expect(tokenId).toEqual("someToken");
  });

  it("gets undefined when no authorization header is provided", () => {
    const tokenId = getIdTokenFromAuthorizationHeader(undefined);
    expect(tokenId).toEqual(undefined);
  });

  it("gets token when the header value has no Bearer", () => {
    const tokenId = getIdTokenFromAuthorizationHeader("someToken");
    expect(tokenId).toEqual("someToken");
  });
});

describe("getCacheControlContextFromHeaders()", () => {
  it("gets default cache control context when no headers found", () => {
    expect(getCacheControlContextFromHeaders(undefined)).toEqual({
      cacheMode: "allow-cache",
    });
  });

  it("gets no-cache control context when no-cache header provided", () => {
    expect(getCacheControlContextFromHeaders("no-cache")).toEqual({
      cacheMode: "no-cache",
    });
  });

  it("gets no-cache control context when no-cache lowercase header provided", () => {
    expect(getCacheControlContextFromHeaders("no-cache")).toEqual({
      cacheMode: "no-cache",
    });
  });

  it("gets max age correctly", () => {
    expect(getCacheControlContextFromHeaders("max-age=50")).toEqual({
      cacheMode: "allow-cache",
      maxAge: 50,
    });
  });

  it("gets max age and cache control correctly", () => {
    expect(getCacheControlContextFromHeaders("no-cache, max-age=50")).toEqual({
      cacheMode: "no-cache",
      maxAge: 50,
    });
  });

  it("gets max age and cache control without spacing correctly", () => {
    expect(getCacheControlContextFromHeaders("no-cache,max-age=50")).toEqual({
      cacheMode: "no-cache",
      maxAge: 50,
    });
  });

  it("handles no-store correctly", () => {
    expect(getCacheControlContextFromHeaders("no-store")).toEqual({
      cacheMode: "no-cache",
    });
  });

  it("handles empty cache control", () => {
    expect(getCacheControlContextFromHeaders("")).toEqual({
      cacheMode: "allow-cache",
    });
  });

  it("handles only if cache correctly", () => {
    expect(getCacheControlContextFromHeaders("only-if-cached")).toEqual({
      cacheMode: "only-cache",
    });
  });

  it("handles invalid max-age number", () => {
    expect(getCacheControlContextFromHeaders("max-age=nope")).toEqual({
      cacheMode: "allow-cache",
    });
  });

  it("handles negative max-age number", () => {
    expect(getCacheControlContextFromHeaders("max-age=-50")).toEqual({
      cacheMode: "allow-cache",
      maxAge: 0,
    });
  });

  it("handles invalid header", () => {
    expect(getCacheControlContextFromHeaders(",,,")).toEqual({
      cacheMode: "allow-cache",
    });
  });
});
