import { delayPromise, promiseEvery, promiseEveryGrouped, promiseEveryWrapped, timeoutPromise } from "../promiseHelper";

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

describe("promiseHelperTests", () => {
  describe("#promiseEvery", () => {
    it("returns only valid results and actions failures", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const failures: any[] = [];
      const results = await promiseEvery(items, testFunction, {
        concurrency: 1,
        delayInMilliseconds: 1,
        actionOnFailure: (failure) => failures.push(failure),
      });
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual("success");

      expect(failures.length).toEqual(2);
    });

    it("returns only valid results", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEvery(items, testFunction);
      expect(results.length).toEqual(1);
      expect(results[0]).toEqual("success");
    });
  });

  describe("#promiseEveryGrouped", () => {
    it("returns results is grouped into either valid or invalid", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEveryGrouped(items, testFunction, { concurrency: 1, delayInMilliseconds: 1 });
      expect(results.valid.length).toEqual(1);
      expect(results.valid[0]).toEqual("success");

      expect(results.invalid.length).toEqual(2);
    });
  });

  describe("#promiseEveryWrapped", () => {
    it("returns each result from the provided function wrapped with a state of true or false", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEveryWrapped(items, testFunction);
      expect(results.length).toEqual(3);
      expect(results[0].state).toEqual(true);
      expect(results[0].value).toEqual("success");
      expect(results[1].state).toEqual(false);
      expect(results[2].state).toEqual(false);
    });

    it("returns each results correctly when options are provided", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEveryWrapped(items, testFunction, { concurrency: 1, delayInMilliseconds: 1 });
      expect(results.length).toEqual(3);
      expect(results[0].state).toEqual(true);
      expect(results[0].value).toEqual("success");
      expect(results[1].state).toEqual(false);
      expect(results[2].state).toEqual(false);
    });

    it("returns no items for empty array", async () => {
      const items: string[] = [];
      const results = await promiseEveryWrapped(items, testFunction);
      expect(results.length).toEqual(0);
    });
  });

  describe("#promiseEveryWrapped", () => {
    it("returns each result from the provided function wrapped with a state of true or false", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEveryWrapped(items, testFunction);
      expect(results.length).toEqual(3);
      expect(results[0].state).toEqual(true);
      expect(results[0].value).toEqual("success");
      expect(results[1].state).toEqual(false);
      expect(results[2].state).toEqual(false);
    });

    it("returns each results correctly when options are provided", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await promiseEveryWrapped(items, testFunction, { concurrency: 1, delayInMilliseconds: 1 });
      expect(results.length).toEqual(3);
      expect(results[0].state).toEqual(true);
      expect(results[0].value).toEqual("success");
      expect(results[1].state).toEqual(false);
      expect(results[2].state).toEqual(false);
    });

    it("returns no items for empty array", async () => {
      const items: string[] = [];
      const results = await promiseEveryWrapped(items, testFunction);
      expect(results.length).toEqual(0);
    });
  });

  describe("#delayPromise", () => {
    it("runs without delay when delay is 0", async () => {
      const result = await delayPromise(testFunction("pass"), 0);
      expect(result).toEqual("success");
    });

    it("runs with delay when delay is 1", async () => {
      const result = await delayPromise(testFunction("pass"), 1);
      expect(result).toEqual("success");
    });
  });

  describe("#timeoutPromise", () => {
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
      } catch (error) {
        expect(error.message).toEqual("Operation failed to complete within the required period of time");
      }
    });
  });
});
