import { ForbiddenError } from "../ForbiddenError";
import { ErrorCode } from "../ErrorCode";
import { HttpStatusCode } from "../HttpStatusCode";

describe("ForbiddenError", () => {
  it("has the correct properties", () => {
    const error = new ForbiddenError("test message");
    expect(error.message).toEqual("test message");
    expect(error.code).toEqual(ErrorCode.FORBIDDEN_ERROR);
    expect(error.httpCode).toEqual(HttpStatusCode.FORBIDDEN_403);
  });
});
