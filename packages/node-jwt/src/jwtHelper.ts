import { UnauthorizedError } from "@link1900/node-error";
import jsonWebToken, { SignOptions } from "jsonwebtoken";
import { getIssuerFromConfig, getSigningKeyForKeyId } from "./jwkHelper";
import { JwtPayload } from "./types/JwtPayload";
import { JwtToken } from "./types/JwtToken";

export function decodeAndVerifyIdTokenForRS256(
  idToken: string,
  publicKey: string,
  issuer: string,
  audience: string
): object {
  const options = {
    algorithm: ["RS256"],
    issuer,
    audience,
  };

  const payload = jsonWebToken.verify(idToken, publicKey, options);
  if (typeof payload === "string") {
    throw new UnauthorizedError(
      "JWT verification failed. Payload was a string"
    );
  }
  return payload;
}

export function signIdTokenForRS256(
  data: string | object,
  expiresInSeconds: number,
  privateKey: string,
  issuer: string,
  audience: string,
  kid?: string
) {
  const options: SignOptions = {
    issuer,
    audience,
    expiresIn: expiresInSeconds,
    algorithm: "RS256",
    keyid: kid,
  };
  return jsonWebToken.sign(data, privateKey, options);
}

export function decodeTokenAsObject(token: string): JwtToken {
  const decodedToken = jsonWebToken.decode(token, { complete: true });
  if (!decodedToken) {
    throw new UnauthorizedError("Decode jwt token failed, invalid jwt token.");
  }
  if (typeof decodedToken === "string") {
    throw new UnauthorizedError(
      "Decode jwt token failed, token payload was not an object."
    );
  }
  return decodedToken as JwtToken;
}

export async function verifyRS256Token(
  issuerConfigUrl: string,
  audience: string,
  token: string
): Promise<JwtPayload> {
  const tokenDecoded = decodeTokenAsObject(token);
  if (
    tokenDecoded?.header?.kid === undefined ||
    tokenDecoded.header.alg !== "RS256" ||
    tokenDecoded.header.typ !== "JWT"
  ) {
    throw new UnauthorizedError("jwt token has invalid header.");
  }
  const issuer = await getIssuerFromConfig(issuerConfigUrl);
  const publicKey = await getSigningKeyForKeyId(
    issuerConfigUrl,
    tokenDecoded?.header?.kid
  );
  return decodeAndVerifyIdTokenForRS256(
    token,
    publicKey,
    issuer,
    audience
  ) as JwtPayload;
}

export function tokenHasNotExpired(token: string): boolean {
  const { payload } = decodeTokenAsObject(token);
  if (payload !== undefined && typeof payload.exp !== 'undefined') {
    const clockTimestamp = Math.floor(Date.now() / 1000);
    if (clockTimestamp >= payload.exp) {
      return false;
    }
  }
  return true;
}
