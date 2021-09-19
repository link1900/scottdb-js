import { isUri } from "../urlValidation";

describe("#isUri", () => {
  const uris = [
    { value: "http://www.google.com", expectedResult: true },
    { value: "https://google.com", expectedResult: true },
    { value: "google.com", expectedResult: false },
    { value: "nope", expectedResult: false },
    { value: "", expectedResult: false },
    { value: { uri: "http://www.google.com" }, expectedResult: false },
    { value: [], expectedResult: false },
    { value: "", expectedResult: false },
    { value: null, expectedResult: false },
    { value: undefined, expectedResult: false },
  ];

  uris.forEach((urlTest) => {
    it(`finds uri ${urlTest.value} to be ${urlTest.expectedResult ? "valid" : "invalid"}`, () => {
      // @ts-ignore
      expect(isUri(urlTest.value)).toEqual(urlTest.expectedResult);
    });
  });
});
