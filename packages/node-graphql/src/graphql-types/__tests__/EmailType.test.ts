import { EmailType } from "../EmailType";

describe("EmailType.serializes()", () => {
  it("serializes a email correctly", () => {
    expect(EmailType.serialize("example@example.com")).toEqual(
      "example@example.com"
    );
  });

  it("does not serialize a non email string", () => {
    expect(EmailType.serialize("no")).toEqual(null);
  });
});

describe("EmailType.parseValue()", () => {
  it("parses a email string correctly", () => {
    const result = EmailType.parseValue("example@example.com");
    expect(result).toEqual("example@example.com");
  });
});

describe("EmailType.parseLiteral()", () => {
  it("parses a email string correctly", () => {
    const result = EmailType.parseLiteral(
      {
        kind: "StringValue",
        value: "example@example.com",
      },
      {}
    );
    expect(result).toEqual("example@example.com");
  });

  it("throws an error when not a string", () => {
    expect(() =>
      EmailType.parseLiteral(
        {
          kind: "FloatValue",
          value: "4",
        },
        {}
      )
    ).toThrowError();
  });
});
