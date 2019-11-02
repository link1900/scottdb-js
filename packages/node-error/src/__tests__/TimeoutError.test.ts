import { TimeoutError } from '../TimeoutError';
import { ErrorCode } from '../ErrorCode';
import { HttpStatusCode } from '../HttpStatusCode';

describe('TimeoutError', () => {
  it('has the correct properties', () => {
    const error = new TimeoutError();
    expect(error.message).toEqual('Operation failed to complete within the required period of time');
    expect(error.code).toEqual(ErrorCode.TIMEOUT);
    expect(error.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR_500);
  });
});
