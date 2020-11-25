import { generateArray, groupArray, removeNils } from '../arrayHelper';

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

  describe('#removeNils', () => {
    it('removes the nils from an array', () => {
      const input = [true, false, { some: 'value' }, 'value', undefined, 5, null, []];
      const result = removeNils<any>(input);
      expect(result.length).toEqual(6);
      expect(result).toEqual([true, false, { some: 'value' }, 'value', 5, []]);
    });

    it('removes the nils from a string array', () => {
      const input = ['value', undefined, 'some', null, 'test'];
      const result = removeNils<string>(input);
      expect(result.length).toEqual(3);
      expect(result).toEqual(['value', 'some', 'test']);
    });
  });
});
