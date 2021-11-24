import { v4 as uuid } from "uuid";
import { ErrorCode } from "./ErrorCode";
import { HttpStatusCode } from "./HttpStatusCode";

export class ServerError extends Error {
  public errorId: string;
  public code: ErrorCode | string;
  public httpCode: HttpStatusCode;

  constructor(
    message: string,
    code: ErrorCode | string,
    httpCode: HttpStatusCode
  ) {
    super(message);
    this.errorId = uuid();
    this.code = code;
    this.httpCode = httpCode;
  }
}
