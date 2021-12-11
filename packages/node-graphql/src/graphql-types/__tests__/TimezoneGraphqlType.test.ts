import { TimezoneGraphqlType } from "../TimezoneGraphqlType";

describe("TimezoneGraphqlType.serializes()", () => {
  it("serializes a timezone correctly", () => {
    expect(TimezoneGraphqlType.serialize("UTC")).toEqual("UTC");
  });

  it("does not serialize a non timezone string", () => {
    expect(TimezoneGraphqlType.serialize("no")).toEqual(null);
  });
});

describe("TimezoneGraphqlType.parseValue()", () => {
  it("parses a timezone string correctly", () => {
    const result = TimezoneGraphqlType.parseValue("UTC");
    expect(result).toEqual("UTC");
  });
});

describe("TimezoneGraphqlType.parseLiteral()", () => {
  it("parses a timezone string correctly", () => {
    const result = TimezoneGraphqlType.parseLiteral(
      {
        kind: "StringValue",
        value: "UTC",
      },
      {}
    );
    expect(result).toEqual("UTC");
  });

  it("throws an error when not a string", () => {
    expect(() =>
      TimezoneGraphqlType.parseLiteral(
        {
          kind: "FloatValue",
          value: "4",
        },
        {}
      )
    ).toThrowError();
  });
});
