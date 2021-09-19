import {
  getBenchmarkStartTime,
  getBenchmarkEndTimeParts,
  getBenchmarkEndTimeMilliseconds,
  convertMillisecondsToString,
  getBenchmarkEndTimeString,
} from "../dateHelper";

describe("dateHelper", () => {
  describe("#getBenchmarkStartTime", () => {
    it("gets start time", () => {
      const result = getBenchmarkStartTime();
      expect(result.length).toEqual(2);
    });
  });

  describe("#getBenchmarkEndTimeParts", () => {
    it("gets end time parts", () => {
      const startMark = getBenchmarkStartTime();
      startMark[0] = startMark[0] - 1000;
      startMark[1] = startMark[1] - 1000;
      const result = getBenchmarkEndTimeParts(startMark);
      expect(result.seconds).toBeTruthy();
      expect(result.milliseconds).toBeTruthy();
    });
  });

  describe("#getBenchmarkEndTimeMilliseconds", () => {
    it("gets time taken in milliseconds", () => {
      const startMark = getBenchmarkStartTime();
      startMark[0] = startMark[0] - 1000;
      startMark[1] = startMark[1] - 1000;
      const result = getBenchmarkEndTimeMilliseconds(startMark);
      expect(result).toBeTruthy();
    });
  });

  describe("#getBenchmarkEndTimeString", () => {
    it("gets time taken as a string", () => {
      const startMark = getBenchmarkStartTime();
      startMark[0] = startMark[0] - 1000;
      startMark[1] = startMark[1] - 1000;
      const result = getBenchmarkEndTimeString(startMark);
      expect(result).toBeTruthy();
    });
  });

  describe("#convertMillisecondsToString", () => {
    it("converts a millisecond value to human readable format", () => {
      expect(convertMillisecondsToString(56160000)).toEqual("15h 36m");
    });

    it("converts a small millisecond value to human readable format", () => {
      expect(convertMillisecondsToString(435)).toEqual("435ms");
    });
  });
});
