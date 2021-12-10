import { decodeTokenAsObject } from "../jwtHelper";

describe("decodeTokenAsObject()", () => {
  it("throws an error when token is invalid", () => {
    expect(() => decodeTokenAsObject("jwtToken")).toThrowError(
      "Decode jwt token failed, invalid jwt token"
    );
  });
});
