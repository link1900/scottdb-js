import {
  anyToObjectString,
  arrayToString,
  base64Decode,
  base64Encode,
  deserializeFromString,
  filterForOnlyLetters,
  formatBytes,
  getHash,
  getHashForString,
  isString,
  serializeToString,
  objectStringToObject,
  unzipStringToString,
  zipStringToString,
  stringToBoolean,
  stringToArray,
} from "../stringHelper";
import exampleJson from "./exampleJson.json";

describe("stringHelper", () => {
  describe("#arrayToString", () => {
    const testCases = [
      {
        value: ["val1", null, "val3"],
        option: undefined,
        expected: "val1 val3",
      },
      { value: [null, "val3"], option: undefined, expected: "val3" },
      { value: ["val1", null, "val3"], option: "-", expected: "val1-val3" },
      { value: "something", option: undefined, expected: "" },
      { value: undefined, option: undefined, expected: "" },
    ];

    testCases.forEach((testCase) => {
      it(`combines strings '${testCase.value}' to be ${
        testCase.expected
      } for options ${JSON.stringify(testCase.option)}`, () => {
        // @ts-ignore
        expect(arrayToString(testCase.value, testCase.option)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe("#stringToArray", () => {
    const testCases = [
      {
        value: "val1 val3",
        option: undefined,
        expected: ["val1", "val3"],
      },
      { value: "", option: undefined, expected: [] },
      {
        value: "  val1  val2 val3   ",
        option: undefined,
        expected: ["val1", "val2", "val3"],
      },
      { value: " ", option: undefined, expected: [] },
      { value: "val3", option: undefined, expected: ["val3"] },
      { value: "val1-val3", option: "-", expected: ["val1", "val3"] },
      { value: null, option: undefined, expected: [] },
      { value: undefined, option: undefined, expected: [] },
    ];

    testCases.forEach((testCase) => {
      it(`splits strings '${testCase.value}' to be ${
        testCase.expected
      } for options ${JSON.stringify(testCase.option)}`, () => {
        // @ts-ignore
        expect(stringToArray(testCase.value, testCase.option)).toEqual(
          testCase.expected
        );
      });
    });
  });

  describe("#filterForOnlyLetters", () => {
    const testCases = [
      { value: "val1", expected: "val" },
      { value: "Hey There", expected: "Hey There" },
      { value: "!@#$%^&*()_+=-yes", expected: "yes" },
      { value: undefined, expected: "" },
    ];

    testCases.forEach((testCase) => {
      it(`filter string '${testCase.value}' to be ${testCase.expected}`, () => {
        expect(filterForOnlyLetters(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#base64Encode", () => {
    it("encodes correctly", () => {
      const text = "someType|90543609845670834";
      const expected = "c29tZVR5cGV8OTA1NDM2MDk4NDU2NzA4MzQ=";
      expect(base64Encode(text)).toEqual(expected);
    });

    it("can base64 encode a piece of text", () => {
      const input = "Hello World";
      const expected = "SGVsbG8gV29ybGQ=";
      expect(base64Encode(input)).toEqual(expected);
    });

    it("can base64 encode null", () => {
      const input = null;
      // @ts-ignore
      expect(base64Encode(input)).toEqual("");
    });

    it("can base64 encode undefined", () => {
      const input = undefined;
      expect(base64Encode(input)).toEqual("");
    });
  });

  describe("#base64Decode", () => {
    it("decodes correctly", () => {
      const text = "c29tZVR5cGV8OTA1NDM2MDk4NDU2NzA4MzQ=";
      const expected = "someType|90543609845670834";
      expect(base64Decode(text)).toEqual(expected);
    });

    it("can base64 decode a piece of text", () => {
      const input = "SGVsbG8gV29ybGQ=";
      const expected = "Hello World";
      expect(base64Decode(input)).toEqual(expected);
    });

    it("can base64 encode null", () => {
      const input = null;
      // @ts-ignore
      expect(base64Decode(input)).toEqual("");
    });

    it("can base64 encode undefined", () => {
      const input = undefined;
      expect(base64Decode(input)).toEqual("");
    });
  });

  describe("#getHashForString", () => {
    it("get a hash of a string", () => {
      const result = getHashForString("someString");
      expect(result).not.toEqual("someString");
    });
  });

  describe("#getHash", () => {
    const inputs = [
      { value: "Scott Brown" },
      { value: null },
      { value: { test: "object" } },
      { value: ["value1", "value2"] },
    ];

    inputs.forEach((input) => {
      it(`converts value ${input.value} to hash string`, () => {
        const hash1 = getHash(input.value);
        const hash2 = getHash(input.value);
        expect(hash1.length > 0).toEqual(true);
        expect(hash1).toEqual(hash2);
      });
    });
  });

  describe("#anyToString and #stringToAny", () => {
    const inputs = [
      { value: "Scott Brown", expected: '{"value":"Scott Brown"}' },
      { value: null, expected: '{"value":null}' },
      { value: undefined, expected: "{}" },
      { value: { test: "object" }, expected: '{"value":{"test":"object"}}' },
      {
        value: ["value1", "value2"],
        expected: '{"value":["value1","value2"]}',
      },
    ];

    inputs.forEach((input) => {
      it(`converts value ${input.value} to string ${input.expected}`, () => {
        const stringResult = anyToObjectString(input.value);
        expect(stringResult).toEqual(input.expected);
        expect(objectStringToObject(stringResult)).toEqual(input.value);
      });
    });
  });

  describe("#stringToAny", () => {
    const inputs = [
      { value: "Scott Brown", expected: undefined },
      { value: '{"value":{"test":"object"}}', expected: { test: "object" } },
    ];

    inputs.forEach((input) => {
      it(`converts value ${input.value} to object ${input.expected}`, () => {
        const objectResult = objectStringToObject(input.value);
        expect(objectResult).toEqual(input.expected);
      });
    });
  });

  describe("#zipStringToString and #unzipStringToString", () => {
    it("zips the string correctly", async () => {
      const bigString = JSON.stringify(exampleJson);
      const zipResult = await zipStringToString(bigString);
      expect(zipResult.length < bigString.length).toEqual(true);
      const unzipResult = await unzipStringToString(zipResult);
      expect(unzipResult).toEqual(bigString);
    });
  });

  describe("#serializeToString and #deserializeFromString", () => {
    it("serialize the object to string correctly and then deserialize back to object", async () => {
      const bigObject = exampleJson;
      const sResult = await serializeToString(bigObject);
      expect(isString(sResult)).toEqual(true);
      const dsResult = await deserializeFromString(sResult);
      expect(dsResult).toEqual(bigObject);
    });

    it("deserialize fails when not a string", async () => {
      // @ts-ignore
      const dsResult = await deserializeFromString(undefined);
      expect(dsResult).toEqual(undefined);
    });
  });

  describe("#formatBytes", () => {
    it("gives format in MB", async () => {
      const result = await formatBytes(152562384);
      expect(result).toEqual("153 MB");
    });
  });

  describe("#stringToBoolean", () => {
    [
      { value: "", expected: false },
      { value: undefined, expected: false },
      { value: null, expected: false },
      { value: "No", expected: false },
      { value: "no", expected: false },
      { value: "NO", expected: false },
      { value: "false", expected: false },
      { value: "f", expected: false },
      { value: "n", expected: false },
      { value: "yes", expected: true },
      { value: "yES", expected: true },
      { value: "YES", expected: true },
      { value: "y", expected: true },
      { value: "t", expected: true },
      { value: "true", expected: true },
      { value: " true", expected: true },
      { value: "true ", expected: true },
      { value: "truE", expected: true },
      { value: "TRUE", expected: true },
      { value: "0", expected: false },
      { value: "1", expected: true },
      { value: "on", expected: true },
      { value: "off", expected: false },
      { value: "active", expected: true },
      { value: "valid", expected: true },
      { value: "inactive", expected: false },
      { value: "invalid", expected: false },
      { value: "blue", expected: false },
    ].forEach(({ value, expected }: any) => {
      it("maps to a boolean false", () => {
        expect(stringToBoolean(value)).toEqual(expected);
      });
    });
  });
});
