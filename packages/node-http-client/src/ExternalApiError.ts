import { ServerError, HttpStatusCode } from "@link1900/node-error";

export type ExternalApiErrorOptions = {
  message?: string;
  externalHttpCode?: HttpStatusCode;
  externalMessage?: string;
  originalError?: Error | unknown;
};

export class ExternalApiError extends ServerError {
  public externalHttpCode?: HttpStatusCode;
  public externalMessage?: string;
  public originalError?: Error | unknown;

  constructor(options: ExternalApiErrorOptions = {}) {
    const {
      message = "external api failed",
      externalHttpCode,
      externalMessage,
      originalError,
    } = options;
    super(message, "EXTERNAL_API_ERROR", HttpStatusCode.INTERNAL_SERVER_ERROR);
    this.externalHttpCode = externalHttpCode;
    this.externalMessage = externalMessage;
    this.originalError = originalError;
  }
}
