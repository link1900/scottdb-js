import { DateTimeInZoneType } from "../DateTimeInZoneType";

describe("DateTimeInZoneType.serializes()", () => {
  it("serializes a string correctly", () => {
    expect(
      DateTimeInZoneType.serialize("2020-06-05T00:00:00.000+00:00")
    ).toEqual("2020-06-05T00:00:00.000+00:00");
  });

  it("does not serialize a non date string", () => {
    expect(DateTimeInZoneType.serialize({ nope: "no" })).toEqual(null);
  });
});

describe("DateTimeInZoneType.parseLiteral()", () => {
  it("throws an error when not a string", () => {
    expect(() =>
      DateTimeInZoneType.parseLiteral(
        {
          kind: "FloatValue",
          value: "4",
        },
        {}
      )
    ).toThrowError();
  });
});
