import { isValidString } from '../stringValidation';

describe('#isValidString', () => {
  const strings = [
    { value: 'something', expectedResult: true },
    { value: '', expectedResult: true },
    { value: {}, expectedResult: false },
    { value: [], expectedResult: false },
    { value: null, expectedResult: false },
    { value: undefined, expectedResult: false },
    { value: '', options: {}, expectedResult: true },

    { value: undefined, options: { min: 5 }, expectedResult: false },
    { value: null, options: { min: 5 }, expectedResult: false },
    { value: '', options: { min: 5 }, expectedResult: false },
    { value: 'so', options: { min: 5 }, expectedResult: false },
    { value: 'some5', options: { min: 5 }, expectedResult: true },
    { value: 'something', options: { min: 5 }, expectedResult: true },
    { value: '', options: { min: 0 }, expectedResult: true },

    { value: undefined, options: { max: 5 }, expectedResult: false },
    { value: null, options: { max: 5 }, expectedResult: false },
    { value: '', options: { max: 5 }, expectedResult: true },
    { value: 'so', options: { max: 5 }, expectedResult: true },
    { value: 'some5', options: { max: 5 }, expectedResult: true },
    { value: 'something', options: { max: 5 }, expectedResult: false },

    { value: 's', options: { min: 2, max: 5 }, expectedResult: false },
    { value: 'some', options: { min: 2, max: 5 }, expectedResult: true },
    { value: 'something', options: { min: 2, max: 5 }, expectedResult: false },

    { value: undefined, options: { regex: /so/ }, expectedResult: false },
    { value: null, options: { regex: /so/ }, expectedResult: false },
    { value: '', options: { regex: /so/ }, expectedResult: false },
    { value: 'so', options: { regex: /so/ }, expectedResult: true },
    { value: 'something', options: { regex: /th/ }, expectedResult: true },
    { value: 'something', options: { regex: /cats/ }, expectedResult: false },

    { value: 'some', options: { min: 2, max: 5, regex: /so/ }, expectedResult: true }
  ];

  strings.forEach(stringTest => {
    it(`finds string value of '${stringTest.value}' to be ${
      stringTest.expectedResult ? 'valid' : 'invalid'
    } for options ${JSON.stringify(stringTest.options)}`, () => {
      // @ts-ignore
      expect(isValidString(stringTest.value, stringTest.options)).toEqual(stringTest.expectedResult);
    });
  });
});
