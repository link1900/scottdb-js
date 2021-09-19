import { getUsedHeap } from "../memoryHelper";

describe("memoryHelper", () => {
  describe("#getUsedHeap", () => {
    it("gets heap size correctly", async () => {
      const result = getUsedHeap();
      expect(result).toBeTruthy();
    });
  });
});
