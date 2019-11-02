import { isPhone } from '../phoneValidation';

describe('#isPhone', () => {
  const validNumbers = [
    '+610435577310',
    '0435577310',
    '+61435577310',
    '435577310',
    '97981234',
    '397981234',
    '0397981234',
    '1800 123 123',
    '+61 (03) 9798 123',
    '(03) 9798 1234'
  ];

  const invalidNumbers = ['nope', '123', '123456789012345678901', '', '    ', undefined, null, { someNumber: '123' }];

  validNumbers.forEach(testNumber => {
    it(`number ${testNumber} to be valid`, () => {
      expect(isPhone(testNumber)).toEqual(true);
    });
  });

  invalidNumbers.forEach(testNumber => {
    it(`number ${testNumber} to be invalid`, () => {
      // @ts-ignore
      expect(isPhone(testNumber)).toEqual(false);
    });
  });
});
