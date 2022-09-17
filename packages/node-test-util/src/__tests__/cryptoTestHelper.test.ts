import { generateRSA256KeyPair } from "../cryptoTestHelper";

describe("cryptoTestHelper", () => {
  describe("generateRSA256KeyPair()", () => {
    it("generates an RSA key pair", () => {
      const result = generateRSA256KeyPair();
      expect(result.privateKey).toContain("BEGIN RSA PRIVATE KEY");
      expect(result.publicKey).toContain("BEGIN PUBLIC KEY");
    });
  });
});
