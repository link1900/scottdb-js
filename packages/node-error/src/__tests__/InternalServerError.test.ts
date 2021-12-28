import { ErrorCode } from "../ErrorCode";
import { HttpStatusCode } from "../HttpStatusCode";
import { InternalServerError } from "../InternalServerError";

describe("InternalServerError", () => {
  it("has the correct properties", () => {
    const serverError = new InternalServerError("test message");
    expect(serverError.message).toEqual("test message");
    expect(serverError.code).toEqual(ErrorCode.INTERNAL_SERVER_ERROR);
    expect(serverError.httpCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR);
  });
});
