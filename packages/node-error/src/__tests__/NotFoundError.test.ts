import { NotFoundError } from "../NotFoundError";
import { ErrorCode } from "../ErrorCode";
import { HttpStatusCode } from "../HttpStatusCode";

describe("NotFoundError", () => {
  it("has the correct properties", () => {
    const error = new NotFoundError("test message");
    expect(error.message).toEqual("test message");
    expect(error.code).toEqual(ErrorCode.NOT_FOUND);
    expect(error.httpCode).toEqual(HttpStatusCode.NOT_FOUND_404);
  });
});
