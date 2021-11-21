import {
  unwrap,
  exists,
  walkObjectAndReplace,
  ReplacementRule,
  objectToString,
  stringToObject,
  objectToJsonObject,
  jsonObjectToObject,
  serializeObjectToString,
  deserializeStringToObject,
  isPresent,
} from "../objectHelper";

describe("objectHelper", () => {
  describe("#unwrap", () => {
    it(`unwraps maybe value something to value something`, () => {
      expect(unwrap("something")).toEqual("something");
    });

    it(`throw an exception when null`, () => {
      expect(() => unwrap(null)).toThrowErrorMatchingSnapshot();
    });

    it(`throw an exception when undefined`, () => {
      expect(() => unwrap(undefined)).toThrowErrorMatchingSnapshot();
    });
  });

  describe("#exists", () => {
    const testCases = [
      { value: "val1", expected: true },
      { value: { some: "object" }, expected: true },
      { value: undefined, expected: false },
      { value: null, expected: false },
    ];

    testCases.forEach((testCase) => {
      it(`exists find '${testCase.value}' to be ${testCase.expected}`, () => {
        expect(exists(testCase.value)).toEqual(testCase.expected);
      });
    });
  });

  describe("#walkObjectAndReplace", () => {
    it("replaces the values correctly", () => {
      const someDate = new Date();
      const toReplace = {
        keyTest: "keyTestValue",
        valueTest: "valueTestValue",
        stringTest: "someStringValue",
        dateTest: someDate,
        numberTest: 5,
        nestedTest: {
          keyTest: "keyTestNested",
          dateTest: someDate,
          doubleNestedTest: {
            keyTest: "keyTestDoubleNested",
            dateTest: someDate,
          },
        },
      };

      const stringReplacer = (value: string) => `${value}Replaced`;
      const dateReplacer = (value: Date) => ({
        fieldType: "date",
        stringValue: value.toISOString(),
      });
      const numberReplacer = (value: number) => (value += 1);
      const rules: ReplacementRule[] = [
        {
          keyRegex: /keyTest/,
          mapping: stringReplacer,
        },
        {
          valueRegex: /valueTestValue/,
          mapping: stringReplacer,
        },
        {
          valueType: "string",
          mapping: stringReplacer,
        },
        {
          valueType: "date",
          mapping: dateReplacer,
        },
        {
          valueType: "number",
          mapping: numberReplacer,
        },
      ];
      const result: any = walkObjectAndReplace(toReplace, rules);
      expect(result).toBeTruthy();
      expect(result.keyTest).toEqual("keyTestValueReplaced");
      expect(result.valueTest).toEqual("valueTestValueReplaced");
      expect(result.stringTest).toEqual("someStringValueReplaced");
      expect(result.dateTest).toEqual({
        fieldType: "date",
        stringValue: someDate.toISOString(),
      });
      expect(result.numberTest).toEqual(6);
      expect(result.nestedTest.keyTest).toEqual("keyTestNestedReplaced");
      expect(result.nestedTest.dateTest).toEqual({
        fieldType: "date",
        stringValue: someDate.toISOString(),
      });
      expect(result.nestedTest.doubleNestedTest.keyTest).toEqual(
        "keyTestDoubleNestedReplaced"
      );
      expect(result.nestedTest.doubleNestedTest.dateTest).toEqual({
        fieldType: "date",
        stringValue: someDate.toISOString(),
      });
    });
  });

  describe("#objectToJsonObject and jsonObjectToObject", () => {
    it("replaces the values correctly", () => {
      const someDate = new Date();
      const toReplace = {
        stringTest: "someStringValue",
        dateTest: someDate,
        numberTest: 5,
        arrayTest: [
          5,
          someDate,
          "arrayStringValue",
          { stringTest: "someString", dateTest: someDate },
        ],
        nestedTest: {
          dateTest: someDate,
          doubleNestedTest: {
            dateTest: someDate,
          },
        },
      };

      const result: any = objectToJsonObject(toReplace);
      expect(result).toBeTruthy();
      expect(result.stringTest).toEqual("someStringValue");
      expect(result.dateTest).toEqual(`___date___${someDate.toISOString()}`);
      expect(result.numberTest).toEqual(5);
      expect(result.arrayTest.length).toEqual(4);
      expect(result.nestedTest.dateTest).toEqual(
        `___date___${someDate.toISOString()}`
      );
      expect(result.nestedTest.doubleNestedTest.dateTest).toEqual(
        `___date___${someDate.toISOString()}`
      );

      const parseResult: any = jsonObjectToObject(result);
      expect(parseResult).toEqual(toReplace);
    });
  });

  describe("#stringToObject", () => {
    it("converts an string to an object", () => {
      expect(stringToObject(`{ "test": "object" }`)).toEqual({
        test: "object",
      });
      // @ts-ignore
      expect(stringToObject(undefined)).toEqual({});
      // @ts-ignore
      expect(stringToObject(null)).toEqual({});
      // @ts-ignore
      expect(stringToObject()).toEqual({});
      expect(stringToObject("invalid")).toEqual({});
    });
  });

  describe("#objectToString", () => {
    it("converts an object to a string", () => {
      expect(objectToString({ test: "object" })).toEqual('{"test":"object"}');
      // @ts-ignore
      expect(objectToString(null)).toEqual("");
      // @ts-ignore
      expect(objectToString()).toEqual("");
      // @ts-ignore
      expect(objectToString("invalid")).toEqual("");
    });
  });

  describe("#serializeObjectToString and deserializeStringToObject", () => {
    it("replaces the values correctly", () => {
      const someDate = new Date();
      const toReplace = {
        stringTest: "someStringValue",
        dateTest: someDate,
        numberTest: 5,
        arrayTest: [
          5,
          someDate,
          "arrayStringValue",
          { stringTest: "someString", dateTest: someDate },
        ],
        nestedTest: {
          dateTest: someDate,
          doubleNestedTest: {
            dateTest: someDate,
          },
        },
      };

      const result: string = serializeObjectToString(toReplace);
      expect(result).toBeTruthy();
      const parseResult: object = deserializeStringToObject(result);
      expect(parseResult).toEqual(toReplace);
    });
  });

  describe("#isPresent", () => {
    it("returns false when the value is nil", () => {
      expect(isPresent(undefined)).toEqual(false);
    });
    it("returns false when the value is nil", () => {
      expect(isPresent("some")).toEqual(true);
    });
  });
});
