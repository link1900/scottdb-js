import { categorizePhoneNumber, getNumberType, isNumberMobileType } from '../phoneHelper';
import { PhoneNumberType } from 'google-libphonenumber';

describe('#getNumberType', () => {
  const testCases = [
    { phone: '0491 570 156', isoCountryCode: 'AU', expected: PhoneNumberType.MOBILE },
    { phone: '+61435577310', isoCountryCode: 'AU', expected: PhoneNumberType.MOBILE },
    { phone: '+610435577310', isoCountryCode: 'AU', expected: PhoneNumberType.MOBILE },
    { phone: '0435 557 310', isoCountryCode: 'AU', expected: PhoneNumberType.MOBILE },
    { phone: '0397691234', isoCountryCode: 'AU', expected: PhoneNumberType.FIXED_LINE },
    { phone: '9769 1234', isoCountryCode: 'AU', expected: PhoneNumberType.UNKNOWN },
    { phone: '0397691234', isoCountryCode: 'au', expected: PhoneNumberType.FIXED_LINE },
    { phone: '(03) 9769 1234', isoCountryCode: 'AU', expected: PhoneNumberType.FIXED_LINE },
    { phone: '1300 975 711', isoCountryCode: 'AU', expected: PhoneNumberType.SHARED_COST },
    { phone: '1800 975 709', isoCountryCode: 'AU', expected: PhoneNumberType.TOLL_FREE },
    { phone: '1900 654 321', isoCountryCode: 'AU', expected: PhoneNumberType.PREMIUM_RATE },
    { phone: '000', isoCountryCode: 'AU', expected: PhoneNumberType.UNKNOWN },
    { phone: 'Nope', isoCountryCode: 'AU', expected: PhoneNumberType.UNKNOWN }
  ];

  testCases.forEach(testCase => {
    it(`get a type of '${Object.keys(PhoneNumberType)[testCase.expected]}' for number '${testCase.phone}'`, () => {
      expect(getNumberType(testCase.phone, testCase.isoCountryCode)).toEqual(testCase.expected);
    });
  });
});

describe('#isNumberMobileType', () => {
  const testCases = [
    { phone: '0491 570 156', isoCountryCode: 'AU', expected: true },
    { phone: '+61435577310', isoCountryCode: 'AU', expected: true },
    { phone: '+610435577310', isoCountryCode: 'AU', expected: true },
    { phone: '0435 557 310', isoCountryCode: 'AU', expected: true },
    { phone: '0397691234', isoCountryCode: 'AU', expected: false },
    { phone: '9769 1234', isoCountryCode: 'AU', expected: false },
    { phone: '0397691234', isoCountryCode: 'au', expected: false },
    { phone: '(03) 9769 1234', isoCountryCode: 'AU', expected: false },
    { phone: '1300 975 711', isoCountryCode: 'AU', expected: false },
    { phone: '1800 975 709', isoCountryCode: 'AU', expected: false },
    { phone: '1900 654 321', isoCountryCode: 'AU', expected: false },
    { phone: '000', isoCountryCode: 'AU', expected: false },
    { phone: 'Nope', isoCountryCode: 'AU', expected: false }
  ];

  testCases.forEach(testCase => {
    it(`number '${testCase.phone}' to be a mobile ${testCase.expected}`, () => {
      expect(isNumberMobileType(testCase.phone, testCase.isoCountryCode)).toEqual(testCase.expected);
    });
  });
});

describe('#categorizePhoneNumber', () => {
  const testCases = [
    { phone: '0491 570 156', isoCountryCode: 'AU', expected: { mobile: '0491 570 156' } },
    { phone: '0435577310', isoCountryCode: 'AU', expected: { mobile: '0435577310' } },
    { phone: '0435577310', isoCountryCode: undefined, expected: { phone: '0435577310' } },
    { phone: '0397691234', isoCountryCode: 'AU', expected: { phone: '0397691234' } },
    { phone: '9769 1234', isoCountryCode: 'AU', expected: { phone: '9769 1234' } },
    { phone: '9769 1234', isoCountryCode: undefined, expected: { phone: '9769 1234' } },
    { phone: undefined, isoCountryCode: 'AU', expected: {} }
  ];

  testCases.forEach(testCase => {
    it(`categorizes phone '${testCase.phone}' to be ${JSON.stringify(testCase.expected)}`, () => {
      expect(categorizePhoneNumber(testCase.phone, testCase.isoCountryCode)).toEqual(testCase.expected);
    });
  });
});
