import {
  chainPromiseFunctions,
  promiseEvery,
  timeoutPromise,
  mapPromiseFunctionSequence,
  promiseFunctionSequence,
} from "../promiseHelper";

export interface ExampleChainContext {
  count: number;
}

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
  return types.map((item) =>
    item === "skipped" ? "skipped" : testFunction(item)
  );
}

function getPromiseFunctionSet(types: string[]): Array<() => Promise<string>> {
  return types.map((item) => {
    return () => {
      return testFunction(item);
    };
  });
}

function mockPromiseFunction(item: string): Promise<string> {
  return testFunction(item);
}

async function testChainFunction(
  context: ExampleChainContext
): Promise<ExampleChainContext> {
  context.count = context.count + 1;
  return context;
}

function testChainNonAsyncFunction(
  context: ExampleChainContext
): ExampleChainContext {
  context.count = context.count + 1;
  return context;
}

function testChainFunctionFailure(item: string) {
  return (): Promise<ExampleChainContext> => {
    return testFunction(item);
  };
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
      const items = getPromiseSet([
        "pass",
        "fail-error",
        "fail-uncaught",
        "skipped",
      ]);
      const results = await promiseEvery(items);
      expect(results).toHaveLength(2);
      expect(results).toEqual(["success", "skipped"]);
    });

    it("throws when errorStrategy equals 'throw'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      await expect(() =>
        promiseEvery(items, { errorStrategy: "throw" })
      ).rejects.toThrowError("example error");
    });

    it("includes undefined if errorStrategy equals 'include'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const results = await promiseEvery(items, { errorStrategy: "include" });
      expect(results).toHaveLength(3);
    });

    it("uses custom onError when provided'", async () => {
      const items = getPromiseSet(["pass", "fail-error", "fail-uncaught"]);
      const errors: any[] = [];
      const results = await promiseEvery(items, {
        errorHandler: (error: any) => errors.push(error),
      });
      expect(results).toHaveLength(1);
      expect(errors).toHaveLength(2);
    });
  });

  describe("promiseFunctionSequence()", () => {
    it("returns only valid results", async () => {
      const items = getPromiseFunctionSet([
        "pass",
        "fail-error",
        "fail-uncaught",
      ]);
      const results = await promiseFunctionSequence(items);
      expect(results).toHaveLength(1);
      expect(results).toEqual(["success"]);
    });

    it("handles non promises", async () => {
      const items = getPromiseFunctionSet([
        "pass",
        "fail-error",
        "fail-uncaught",
        "skipped",
      ]);
      const results = await promiseFunctionSequence(items);
      expect(results).toHaveLength(2);
      expect(results).toEqual(["success", "skipped"]);
    });

    it("includes undefined if errorStrategy equals 'include'", async () => {
      const items = getPromiseFunctionSet([
        "pass",
        "fail-error",
        "fail-uncaught",
      ]);
      const results = await promiseFunctionSequence(items, {
        errorStrategy: "include",
      });
      expect(results).toHaveLength(3);
    });

    it("throws when errorStrategy equals 'throw'", async () => {
      const items = getPromiseFunctionSet([
        "pass",
        "fail-error",
        "fail-uncaught",
      ]);
      await expect(() =>
        promiseFunctionSequence(items, { errorStrategy: "throw" })
      ).rejects.toThrowError("example error");
    });

    it("uses custom onError when provided'", async () => {
      const items = getPromiseFunctionSet([
        "pass",
        "fail-error",
        "fail-uncaught",
      ]);
      const errors: any[] = [];
      const results = await promiseFunctionSequence(items, {
        errorHandler: (error: any) => errors.push(error),
      });
      expect(results).toHaveLength(1);
      expect(errors).toHaveLength(2);
    });
  });

  describe("mapPromiseFunctionSequence()", () => {
    it("returns only valid results", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await mapPromiseFunctionSequence(
        items,
        mockPromiseFunction
      );
      expect(results).toHaveLength(1);
      expect(results).toEqual(["success"]);
    });

    it("handles non promises", async () => {
      const items = ["pass", "fail-error", "fail-uncaught", "skipped"];
      const results = await mapPromiseFunctionSequence(
        items,
        mockPromiseFunction
      );
      expect(results).toHaveLength(2);
      expect(results).toEqual(["success", "skipped"]);
    });

    it("includes undefined if errorStrategy equals 'include'", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const results = await mapPromiseFunctionSequence(
        items,
        mockPromiseFunction,
        { errorStrategy: "include" }
      );
      expect(results).toHaveLength(3);
    });

    it("throws when errorStrategy equals 'throw'", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      await expect(() =>
        mapPromiseFunctionSequence(items, mockPromiseFunction, {
          errorStrategy: "throw",
        })
      ).rejects.toThrowError("example error");
    });

    it("uses custom onError when provided'", async () => {
      const items = ["pass", "fail-error", "fail-uncaught"];
      const errors: any[] = [];
      const results = await mapPromiseFunctionSequence(
        items,
        mockPromiseFunction,
        {
          errorHandler: (error: any) => errors.push(error),
        }
      );
      expect(results).toHaveLength(1);
      expect(errors).toHaveLength(2);
    });
  });

  describe("chainPromiseFunctions()", () => {
    it("returns the correct context", async () => {
      const result = await chainPromiseFunctions({ count: 0 }, [
        testChainFunction,
        testChainFunction,
        testChainFunction,
      ]);
      expect(result).toEqual({ count: 3 });
    });

    it("handles failures", async () => {
      const result = await chainPromiseFunctions({ count: 0 }, [
        testChainFunction,
        testChainFunctionFailure("fail-error"),
        testChainFunction,
      ]);
      expect(result).toEqual({ count: 2 });
    });

    it("handles non async functions", async () => {
      const result = await chainPromiseFunctions({ count: 0 }, [
        testChainFunction,
        testChainNonAsyncFunction,
        testChainFunction,
      ]);
      expect(result).toEqual({ count: 3 });
    });

    it("throws when errorStrategy equals 'throw'", async () => {
      await expect(() =>
        chainPromiseFunctions(
          { count: 0 },
          [
            testChainFunction,
            testChainFunctionFailure("fail-error"),
            testChainFunction,
          ],
          { errorStrategy: "throw" }
        )
      ).rejects.toThrowError("example error");
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
        await timeoutPromise(new Promise(() => {}), 10);
        expect(true).toBeFalsy();
      } catch (error) {
        expect(error.message).toEqual(
          "Operation failed to complete within the required period of time"
        );
      }
    });
  });
});
