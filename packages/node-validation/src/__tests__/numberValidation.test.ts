import { isValidNumber } from '../numberValidation';

describe('#isValidNumber', () => {
  const testCases = [
    { value: 5, expectedResult: true },
    { value: '', expectedResult: false },
    { value: {}, expectedResult: false },
    { value: [], expectedResult: false },
    { value: null, expectedResult: false },
    { value: undefined, expectedResult: false },

    { value: 4, options: { min: 5 }, expectedResult: false },
    { value: 5, options: { min: 5 }, expectedResult: true },
    { value: 6, options: { min: 5 }, expectedResult: true },

    { value: 4, options: { max: 5 }, expectedResult: true },
    { value: 5, options: { max: 5 }, expectedResult: true },
    { value: 6, options: { max: 5 }, expectedResult: false },

    { value: 4, options: { min: 5, max: 8 }, expectedResult: false },
    { value: 5, options: { min: 5, max: 8 }, expectedResult: true },
    { value: 6, options: { min: 5, max: 8 }, expectedResult: true },
    { value: 8, options: { min: 5, max: 8 }, expectedResult: true },
    { value: 9, options: { min: 5, max: 8 }, expectedResult: false },

    { value: 9, options: { isOnly: [5] }, expectedResult: false },
    { value: 9, options: { isOnly: [9] }, expectedResult: true }
  ];

  testCases.forEach(testcase => {
    it(`finds number value of '${testcase.value}' to be ${
      testcase.expectedResult ? 'valid' : 'invalid'
    } for options ${JSON.stringify(testcase.options)}`, () => {
      expect(isValidNumber(testcase.value, testcase.options)).toEqual(testcase.expectedResult);
    });
  });
});
