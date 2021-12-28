import { JwtPayload } from "@link1900/node-jwt";

export interface JwtAuthContext {
  authenticated?: boolean;
  token?: string;
  decodedToken?: JwtPayload;
}
