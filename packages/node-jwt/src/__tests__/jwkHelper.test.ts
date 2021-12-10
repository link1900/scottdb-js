import { mockApiFunctionBuilder } from "@link1900/node-test-util";
import { getIssuerConfig, setIssuerConfig } from "../jwkHelper";
import exampleIssuerConfig from "./exampleIssuerConfig.json";

const ISSUER_CONFIG_URL =
  "https://example.com/.well-known/openid-configuration";

const mockIssuerConfigEndpoint = mockApiFunctionBuilder({
  baseUrl: "https://example.com",
  path: "/.well-known/openid-configuration",
  method: "GET",
  status: 200,
  body: exampleIssuerConfig,
});

describe("getIssuerConfig()", () => {
  beforeEach(() => {
    setIssuerConfig(undefined);
  });

  it("fetches the issuer config correctly", async () => {
    const apiMock = mockIssuerConfigEndpoint();
    const config = await getIssuerConfig(ISSUER_CONFIG_URL);
    expect(config).toEqual(exampleIssuerConfig);
    expect(apiMock.isDone()).toEqual(true);
  });

  it("throw error when jwks_uri is missing", async () => {
    const apiMock = mockIssuerConfigEndpoint({ body: {} });
    await expect(getIssuerConfig(ISSUER_CONFIG_URL)).rejects.toThrowError(
      "No jwks_uri present"
    );
    expect(apiMock.isDone()).toEqual(true);
  });

  it("throw error when issuer is missing", async () => {
    const apiMock = mockIssuerConfigEndpoint({
      body: { jwks_uri: "some url" },
    });
    await expect(getIssuerConfig(ISSUER_CONFIG_URL)).rejects.toThrowError(
      "No issuer present"
    );
    expect(apiMock.isDone()).toEqual(true);
  });
});
