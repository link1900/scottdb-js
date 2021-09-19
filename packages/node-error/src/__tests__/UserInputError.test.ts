import { UserInputError } from "../UserInputError";
import { InvalidFieldReason } from "../InvalidFieldReason";

describe("UserInputError", () => {
  it("has the correct properties", () => {
    const serverError = new UserInputError("test message", "field1", InvalidFieldReason.REQUIRED);
    expect(serverError.message).toEqual("test message");
    expect(serverError.invalidField).toEqual("field1");
    expect(serverError.invalidReason).toEqual(InvalidFieldReason.REQUIRED);
  });
});
