import { getBenchmarkStartTime, getBenchmarkEndTimeParts, getBenchmarkEndTime } from '../dateHelper';

describe('dateHelper', () => {
  describe('#getBenchmarkStartTime', () => {
    it('gets start time', () => {
      const result = getBenchmarkStartTime();
      expect(result.length).toEqual(2);
    });
  });

  describe('#getBenchmarkEndTimeParts', () => {
    it('gets end time parts', () => {
      const startMark = getBenchmarkStartTime();
      startMark[0] = startMark[0] - 1000;
      startMark[1] = startMark[1] - 1000;
      const result = getBenchmarkEndTimeParts(startMark);
      expect(result.seconds).toBeTruthy();
      expect(result.milliseconds).toBeTruthy();
    });
  });

  describe('#getBenchmarkEndTime', () => {
    it('gets time taken', () => {
      const startMark = getBenchmarkStartTime();
      startMark[0] = startMark[0] - 1000;
      startMark[1] = startMark[1] - 1000;
      const result = getBenchmarkEndTime(startMark);
      expect(result).toBeTruthy();
    });
  });
});
