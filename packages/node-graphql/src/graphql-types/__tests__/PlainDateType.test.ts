import moment from "moment-timezone";
import { PlainDateType } from "../PlainDateType";

describe("PlainDate.serializes()", () => {
  it("serializes a moment correctly", () => {
    expect(PlainDateType.serialize(moment(new Date(2020, 5, 5)))).toEqual(
      "2020-06-05"
    );
  });

  it("serializes a date correctly", () => {
    expect(PlainDateType.serialize(new Date(2020, 5, 5))).toEqual("2020-06-05");
  });

  it("serializes a string correctly", () => {
    expect(PlainDateType.serialize("2020-06-05")).toEqual("2020-06-05");
  });

  it("does not serialize a non date string", () => {
    expect(PlainDateType.serialize({ nope: "no" })).toEqual(null);
  });
});

describe("DateTimeInZone.parseLiteral()", () => {
  it("throws an error when not a string", () => {
    expect(() =>
      PlainDateType.parseLiteral(
        {
          kind: "FloatValue",
          value: "4",
        },
        {}
      )
    ).toThrowError();
  });
});
