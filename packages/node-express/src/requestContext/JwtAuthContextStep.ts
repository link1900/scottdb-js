import { InternalServerError } from "@link1900/node-error";
import { JwtPayload, verifyRS256Token } from "@link1900/node-jwt";
import { logger } from "@link1900/node-logger-api";
import { Step } from "@link1900/node-util";
import { getIdTokenFromAuthorizationHeader } from "../headerHelper";
import { ExpressRequestContext } from "./ExpressRequestContext";
import { JwtAuthContext } from "./JwtAuthContext";

export type JwtValidator = (idToken: string) => Promise<JwtPayload>;

export interface JwtAuthContextStepProps {
  audience?: string;
  configUrl?: string;
  jwtValidator?: JwtValidator;
}
export class JwtAuthContextStep extends Step<
  ExpressRequestContext & JwtAuthContext
> {
  audience?: string;
  configUrl?: string;
  jwtValidator?: (idToken: string) => Promise<JwtPayload>;

  constructor(props: JwtAuthContextStepProps) {
    super();
    const { audience, configUrl, jwtValidator } = props;
    this.audience = audience;
    this.configUrl = configUrl;
    this.jwtValidator = jwtValidator;
  }

  async validateJwt(token: string): Promise<JwtPayload> {
    if (this.jwtValidator) {
      return this.jwtValidator(token);
    }
    if (this.configUrl === undefined || this.audience === undefined) {
      throw new InternalServerError(
        "unable to validate jwt. AuthContextBuilder requires either configUrl and audience or a jwtValidator"
      );
    }
    return verifyRS256Token(this.configUrl, this.audience, token);
  }

  async run(
    context: ExpressRequestContext & JwtAuthContext
  ): Promise<ExpressRequestContext & JwtAuthContext> {
    const { express } = context;
    if (!express) {
      return context;
    }

    const { req } = express;

    const authHeader = req.get("Authorization");
    const token = getIdTokenFromAuthorizationHeader(authHeader);

    if (!token) {
      logger.debug("no token found in Authorization header");
      context.authenticated = false;
      return context;
    }

    try {
      const decodedToken = await this.validateJwt(token);
      context.authenticated = true;
      context.decodedToken = decodedToken;
      context.token = token;
      return context;
    } catch (e) {
      logger.error("jwt validation failed during auth context building.", e);
      context.authenticated = false;
      return context;
    }
  }
}
