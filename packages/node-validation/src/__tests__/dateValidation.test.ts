import { isFutureDate, isValidISODateString } from '../dateValidation';
import moment from 'moment-timezone';

describe('dateValidation tests', () => {
  describe('#isFutureDate', () => {
    it('returns false when passed date is in the past', () => {
      const pastDate = moment().subtract(1, 'years');
      const result = isFutureDate(pastDate.toDate());
      expect(result).toEqual(false);
    });

    it('returns false when passed invalid value', () => {
      const result = isFutureDate(undefined);
      expect(result).toEqual(false);
    });

    it('return true when passed date is in the future', () => {
      const futureDate = moment().add(1, 'years');
      const result = isFutureDate(futureDate.toDate());
      expect(result).toEqual(true);
    });
  });

  describe('#isValidISODateString', () => {
    const strings = [
      { value: 'something', expectedResult: false },
      { value: undefined, expectedResult: false },
      { value: '2019-02-09T10:43:11.741Z', expectedResult: true }
    ];

    strings.forEach(stringTest => {
      it(`finds string value of '${stringTest.value}' to be ${stringTest.expectedResult ? 'valid' : 'invalid'}`, () => {
        // @ts-ignore
        expect(isValidISODateString(stringTest.value, stringTest.options)).toEqual(stringTest.expectedResult);
      });
    });
  });
});
