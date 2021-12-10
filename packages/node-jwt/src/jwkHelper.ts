import {
  ExternalApiError,
  makeValidJsonRequest,
} from "@link1900/node-http-client";
import jwksRsa, { JwksClient } from "jwks-rsa";

interface IssuerConfig {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  mfa_challenge_endpoint: string;
  jwks_uri: string;
  registration_endpoint: string;
  revocation_endpoint: string;
  scopes_supported: string[];
  response_types_supported: string[];
  code_challenge_methods_supported: string[];
  response_modes_supported: string[];
  subject_types_supported: string[];
  id_token_signing_alg_values_supported: string[];
  token_endpoint_auth_methods_supported: string[];
  claims_supported: string[];
  request_uri_parameter_supported: boolean;
  device_authorization_endpoint: string;
}

let jwksClient: JwksClient | undefined;
let issuerConfig: IssuerConfig | undefined;

export async function getIssuerConfig(
  issuerConfigUrl: string
): Promise<IssuerConfig> {
  if (!issuerConfig) {
    const config = await makeValidJsonRequest<IssuerConfig>({
      url: issuerConfigUrl,
    });
    if (!config.jwks_uri) {
      throw new ExternalApiError({
        message:
          "[jwtKey.getIssuerConfig] No jwks_uri present in the openid-configuration response body",
      });
    }
    if (!config.issuer) {
      throw new ExternalApiError({
        message:
          "[jwtKey.getIssuerConfig] No issuer present in the openid-configuration response body",
      });
    }
    issuerConfig = config;
  }

  return issuerConfig;
}

export function setIssuerConfig(newConfig: IssuerConfig | undefined) {
  issuerConfig = newConfig;
}

export async function getJwksClient(
  issuerConfigUrl: string
): Promise<JwksClient> {
  if (!jwksClient) {
    const config = await getIssuerConfig(issuerConfigUrl);
    jwksClient = jwksRsa({
      cache: true,
      cacheMaxEntries: 100,
      cacheMaxAge: 604800000, // 1 week
      rateLimit: true,
      jwksRequestsPerMinute: 1,
      jwksUri: config.jwks_uri,
    });
  }
  return jwksClient;
}

export function setJwksClient(client: JwksClient | undefined) {
  jwksClient = client;
}

export async function getSigningKeyForKeyId(
  issuerConfigUrl: string,
  kid: string
): Promise<string> {
  const keyClient = await getJwksClient(issuerConfigUrl);
  const keyObject = await keyClient.getSigningKeyAsync(kid);
  return keyObject.getPublicKey();
}

export async function getIssuerFromConfig(
  issuerConfigUrl: string
): Promise<string> {
  const config = await getIssuerConfig(issuerConfigUrl);
  return config.issuer;
}
