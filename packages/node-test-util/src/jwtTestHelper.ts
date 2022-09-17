import jwtHelper, { SignOptions } from "jsonwebtoken";
import { getTestRSAPrivateKey, getTestRSAPublicKey } from "./cryptoTestHelper";

interface GenerateTestJwtTokenOptions {
  issuer?: string;
  audience?: string;
  expiresIn?: number;
  payload?: object;
}

export function generateTestJwtToken(
  options: GenerateTestJwtTokenOptions = {}
) {
  const {
    issuer = "test",
    audience = "test",
    expiresIn = 1000,
    payload = { userId: "example-user-id" }
  } = options;

  const signOptions: SignOptions = {
    issuer,
    audience,
    expiresIn,
    algorithm: "RS256"
  };
  return jwtHelper.sign(
    payload,
    { key: getTestRSAPrivateKey(), passphrase: "test" },
    signOptions
  );
}

export function getTestJwtPublicKey() {
  return getTestRSAPublicKey();
}
