import { TimeoutError } from "@link1900/node-error";
import { logger } from "@link1900/node-logger";
import { isPresent } from "./objectHelper";

export interface PromiseErrorOptions {
  errorStrategy?: "onError" | "throw" | "include";
  onError?: (reason: any) => any;
}

export function logFailedPromise(reason: any) {
  logger.error("promise failed", reason);
}

export function handlePromiseFailure(
  result: any,
  options: PromiseErrorOptions = {}
) {
  const { errorStrategy = "onError", onError = logFailedPromise } = options;
  if (errorStrategy === "onError") {
    onError(result);
  }
  if (errorStrategy === "throw") {
    throw result;
  }
  if (errorStrategy === "include") {
    return result;
  }
  return undefined;
}

/**
 * Converts an array of promises into a promise array of resolved values.
 * All promises run concurrently.
 * Will execute every promise and what is returned is determined by options.errorStrategy
 * @param items
 * @param options
 */
export async function promiseEvery<Item>(
  items: Array<Promise<Item> | Item>,
  options: PromiseErrorOptions = {}
): Promise<Array<Item>> {
  const { errorStrategy = "onError" } = options;
  let results = (await Promise.allSettled(items)).map((result) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    if (result.status === "rejected") {
      return handlePromiseFailure(result.reason, options);
    }

    return undefined;
  });

  if (errorStrategy !== "include") {
    results = results.filter(isPresent);
  }

  return results;
}

/**
 * Converts an array of promises into a promise of array of resolved values.
 * All promises will in order one by one, in array sequence.
 */
export async function promiseSequence<Item>(
  items: Array<Promise<Item> | Item>,
  options: PromiseErrorOptions = {}
): Promise<Array<Item>> {
  const results: Item[] = [];
  const { errorStrategy = "onError" } = options;
  for (let item of items) {
    try {
      const result = await item;
      results.push(result);
    } catch (error) {
      const failureResult = handlePromiseFailure(error, options);
      if (errorStrategy === "include") {
        results.push(failureResult);
      }
    }
  }
  return results;
}

export async function delayPromise<T>(
  promise: T,
  delayInMilliseconds: number
): Promise<T> {
  if (delayInMilliseconds <= 0) {
    return promise;
  }
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve(promise);
      clearTimeout(timeoutId);
    }, delayInMilliseconds);
  });
}

export async function timeoutPromise<T>(
  promise: T,
  timeoutInMilliseconds: number,
  error: Error = new TimeoutError()
): Promise<T> {
  if (timeoutInMilliseconds <= 0) {
    return promise;
  }
  let timer;

  try {
    const result = await Promise.race([
      promise,
      new Promise(
        (resolve, reject) =>
          (timer = setTimeout(reject, timeoutInMilliseconds, error))
      ),
    ]);
    return result as any as T;
  } finally {
    clearTimeout(timer);
  }
}
