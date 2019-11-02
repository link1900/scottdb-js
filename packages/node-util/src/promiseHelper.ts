import BlueBird from 'bluebird';
import { TimeoutError } from '@link1900/node-error';

export interface BasicMapPromiseOptions {
  concurrency?: number;
  delayInMilliseconds?: number;
}

export interface WrappedPromise<T, R> {
  state: boolean;
  value: R;
  item: T;
}

export interface GroupedPromises<T> {
  valid: T[];
  invalid: any[];
}

export interface MapPromiseOptions extends BasicMapPromiseOptions {
  actionOnFailure?: (failureValue?: any, item?: any) => any;
}

export async function promiseEvery<T, R>(items: T[], func: (item: T) => Promise<R>, options?: MapPromiseOptions) {
  const resultGroups = await promiseEveryGrouped(items, func, options);
  if (resultGroups.invalid.length > 0 && options && options.actionOnFailure) {
    resultGroups.invalid.forEach(invalidItem => {
      if (options.actionOnFailure) {
        return options.actionOnFailure(invalidItem.value, invalidItem.item);
      }
    });
  }
  return resultGroups.valid;
}

export async function promiseEveryGrouped<T, R>(
  items: T[],
  func: (item: T) => Promise<R>,
  options?: BasicMapPromiseOptions
): Promise<GroupedPromises<R>> {
  const wrappedPromises = await promiseEveryWrapped(items, func, options);
  return {
    valid: wrappedPromises.filter(result => result.state).map(result => result.value),
    invalid: wrappedPromises.filter(result => !result.state).map(result => ({ value: result.value, item: result.item }))
  };
}

export async function promiseEveryWrapped<T, R>(
  items: T[],
  func: (item: T) => Promise<R>,
  options?: BasicMapPromiseOptions
): Promise<Array<WrappedPromise<T, R>>> {
  const concurrency = options && options.concurrency ? options.concurrency : 1;
  const delayInMilliseconds = options && options.delayInMilliseconds ? options.delayInMilliseconds : 0;

  return BlueBird.map(
    items,
    async item => {
      try {
        return {
          state: true,
          value: await delayPromise(func(item), delayInMilliseconds),
          item
        };
      } catch (error) {
        return { state: false, value: error, item };
      }
    },
    { concurrency }
  );
}

export async function delayPromise<T>(promise: T, delayInMilliseconds: number): Promise<T> {
  if (delayInMilliseconds <= 0) {
    return promise;
  }
  return BlueBird.resolve(promise).delay(delayInMilliseconds);
}

export async function timeoutPromise<T>(
  promise: T,
  timeoutInMilliseconds: number,
  error: Error = new TimeoutError()
): Promise<T> {
  if (timeoutInMilliseconds <= 0) {
    return promise;
  }
  return BlueBird.resolve(promise).timeout(timeoutInMilliseconds, error);
}
