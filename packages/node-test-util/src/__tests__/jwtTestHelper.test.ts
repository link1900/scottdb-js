import jwtHelper from "jsonwebtoken";
import { generateTestJwtToken, getTestJwtPublicKey } from "../jwtTestHelper";

describe("jwtTestHelper", () => {
  describe("generateTestJwtToken()", () => {
    it("create a real jwt that is signed with a test key", () => {
      const result = generateTestJwtToken();
      expect(result).toContain(".");
      const decoded = jwtHelper.decode(result);
      expect(decoded).toEqual({
        aud: "test",
        exp: expect.anything(),
        iat: expect.anything(),
        iss: "test",
        userId: "example-user-id"
      });
      const options = {
        algorithm: ["RS256"],
        audience: "test",
        issuer: "test"
      };
      const verified = jwtHelper.verify(result, getTestJwtPublicKey(), options);
      expect(verified).toEqual({
        aud: "test",
        exp: expect.anything(),
        iat: expect.anything(),
        iss: "test",
        userId: "example-user-id"
      });
    });
  });
});
