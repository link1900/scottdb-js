import { generateArray, groupArray } from '../arrayHelper';

describe('arrayHelper', () => {
  describe('#generateArray', () => {
    it('creates a new array with the correct values', () => {
      const results = generateArray(5, () => 'a');
      expect(results.length).toEqual(5);
      expect(results.every(i => i === 'a')).toEqual(true);
    });
  });

  describe('#groupArray', () => {
    it('groups array elements together', () => {
      const input = [true, false, true, false, false];
      const result = groupArray(input);
      expect(result.length).toEqual(2);
      const trueGroup = result.find(g => g.key === true);
      expect(trueGroup).toBeTruthy();
      expect(trueGroup && trueGroup.values.length).toEqual(2);
      const falseGroup = result.find(g => g.key === false);
      expect(falseGroup).toBeTruthy();
      expect(falseGroup && falseGroup.values.length).toEqual(3);
    });
  });
});
