import { ErrorCode } from './ErrorCode';
import { ServerError } from './ServerError';
import { HttpStatusCode } from './HttpStatusCode';
import { InvalidFieldReason } from './InvalidFieldReason';

export class UserInputError extends ServerError {
  public invalidField: string;
  public invalidReason: string;
  constructor(message: string, invalidField: string, invalidReason: InvalidFieldReason) {
    super(message, ErrorCode.USER_INPUT_ERROR, HttpStatusCode.BAD_REQUEST_400);
    this.invalidField = invalidField;
    this.invalidReason = invalidReason;
  }
}
