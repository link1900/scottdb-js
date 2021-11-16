import { delayPromise, promiseEvery, timeoutPromise, promiseSequence } from "../promiseHelper";

async function testFunction(result: string) {
  if (result === "fail-error") {
    throw new Error("example error");
  }
  if (result === "pass") {
    return "success";
  }
  if (result === "fail-uncaught") {
    // @ts-ignore
    return result.notAField.notAField;
  }
  return result;
}

function getPromiseSet(types: string[]): Array<Promise<string> | string> {
  return types.map((item) => (item === "skipped" ? "skipped" : testFunction(item)));
}

describe("promiseHelperTests", () => {
  describe("promiseEvery()", () => {
    it("returns only valid results", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const results = await promiseEvery(items);
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual("success");
    });

    it("handles non promises", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught", "skipped"]);
      const results = await promiseEvery(items);
      expect(results).toHaveLength(2);
      expect(results).toEqual(["success", "skipped"]);
    });

    it("throws when errorStrategy equals 'throw'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      await expect(() => promiseEvery(items, { errorStrategy: "throw" })).rejects.toThrowError("example error");
    });

    it("includes undefined if errorStrategy equals 'include'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const results = await promiseEvery(items, { errorStrategy: "include" });
      expect(results).toHaveLength(3);
    });

    it("uses custom onError when provided'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const errors: any[] = [];
      const results = await promiseEvery(items, { onError: (error: any) => errors.push(error) });
      expect(results).toHaveLength(1);
      expect(errors).toHaveLength(2);
    });
  });

  describe("promiseSequence()", () => {
    it("returns only valid results", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const results = await promiseSequence(items);
      expect(results).toHaveLength(1);
      expect(results).toEqual(["success"]);
    });

    it("handles non promises", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught", "skipped"]);
      const results = await promiseSequence(items);
      expect(results).toHaveLength(2);
      expect(results).toEqual(["success", "skipped"]);
    });

    it("includes undefined if errorStrategy equals 'include'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const results = await promiseSequence(items, { errorStrategy: "include" });
      expect(results).toHaveLength(3);
    });

    it("uses custom onError when provided'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const errors: any[] = [];
      const results = await promiseSequence(items, { onError: (error: any) => errors.push(error) });
      expect(results).toHaveLength(1);
      expect(errors).toHaveLength(2);
    });
  });

  describe("delayPromise()", () => {
    it("runs without delay when delay is 0", async () => {
      const result = await delayPromise(testFunction("pass"), 0);
      expect(result).toEqual("success");
    });

    it("runs with delay when delay is 1000", async () => {
      const result = await delayPromise(testFunction("pass"), 1000);
      expect(result).toEqual("success");
    });
  });

  describe("timeoutPromise()", () => {
    it("runs without timeout when timeout is 0", async () => {
      const result = await timeoutPromise(testFunction("pass"), 0);
      expect(result).toEqual("success");
    });

    it("runs and beats timeout when timeout is 100000", async () => {
      const result = await timeoutPromise(testFunction("pass"), 100000);
      expect(result).toEqual("success");
    });

    it("throws error when does not finished before the timeout", async () => {
      try {
        await timeoutPromise(delayPromise(testFunction("pass"), 10000), 10);
        expect(true).toBeFalsy();
      } catch (error: any) {
        expect(error.message).toEqual("Operation failed to complete within the required period of time");
      }
    });
  });
});
