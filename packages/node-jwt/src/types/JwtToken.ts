import { JwtHeader } from "./JwtHeader";
import { JwtPayload } from "./JwtPayload";

export interface JwtToken {
  header?: JwtHeader;
  payload?: JwtPayload;
}
