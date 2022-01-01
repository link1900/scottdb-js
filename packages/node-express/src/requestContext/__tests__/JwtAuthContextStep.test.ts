import { JwtAuthContextStep } from "../JwtAuthContextStep";
import { JwtPayload } from "@link1900/node-jwt";
import { logger } from "@link1900/node-logger";

jest.mock("@link1900/node-logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

const exampleContext: any = {
  express: {
    req: {
      get: () => {
        return "Bearer someToken";
      },
      headers: {
        authorization: "Bearer someToken",
      },
    },
  },
};

const exampleEmptyContext: any = {
  express: {
    req: {
      get: () => {
        return undefined;
      },
    },
  },
};

const baseMockJwt = {
  iss: "issuer",
  sub: "auth0|user|123",
  aud: ["https://example.com"],
  iat: 1598333668,
  exp: 1598420068,
  azp: "123",
  scope: "openid email all",
};

function getMockJwtPayload(overrides?: Partial<JwtPayload>) {
  return {
    ...baseMockJwt,
    ...overrides,
  };
}

async function fakeValidator(token: string): Promise<JwtPayload> {
  return getMockJwtPayload();
}

async function fakeFailingValidator(token: string): Promise<JwtPayload> {
  throw new Error("token is invalid");
}

describe("JwtAuthContextBuilder", () => {
  it("build auth context", async () => {
    const step = new JwtAuthContextStep({ jwtValidator: fakeValidator });
    const result = await step.run(exampleContext);
    expect(result).toEqual({
      authenticated: true,
      decodedToken: baseMockJwt,
      token: "someToken",
      ...exampleContext,
    });
  });

  it("build empty auth context when no token is in headers", async () => {
    const step = new JwtAuthContextStep({ jwtValidator: fakeValidator });
    const result = await step.run(exampleEmptyContext);
    expect(result).toEqual({
      authenticated: false,
      ...exampleEmptyContext,
    });
  });

  it("build empty auth context auth fails", async () => {
    const step = new JwtAuthContextStep({
      jwtValidator: fakeFailingValidator,
    });
    const result = await step.run(exampleContext);
    expect(result).toEqual({
      authenticated: false,
      ...exampleContext,
    });
  });

  it("build empty auth context when there is no token validator config", async () => {
    const step = new JwtAuthContextStep({});
    const result = await step.run(exampleContext);
    expect(result).toEqual({
      authenticated: false,
      ...exampleContext,
    });
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringMatching(/jwt validation failed /),
      expect.any(Error)
    );
  });
});
