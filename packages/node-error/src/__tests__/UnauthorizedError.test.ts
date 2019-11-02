import { UnauthorizedError } from '../UnauthorizedError';
import { ErrorCode } from '../ErrorCode';
import { HttpStatusCode } from '../HttpStatusCode';

describe('UnauthorizedError', () => {
  it('has the correct properties', () => {
    const error = new UnauthorizedError('test message');
    expect(error.message).toEqual('test message');
    expect(error.code).toEqual(ErrorCode.UNAUTHORIZED_ERROR);
    expect(error.httpCode).toEqual(HttpStatusCode.UNAUTHORIZED_401);
  });
});
