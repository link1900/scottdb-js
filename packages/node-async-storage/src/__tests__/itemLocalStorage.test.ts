import { AsyncLocalStorage } from "async_hooks";
import {
  getItemLocalContext,
  setItemLocalContext,
  getLocalItem,
  setLocalItem,
  ItemLocalStorage,
} from "../itemLocalStorage";

function testGetItemSync() {
  return getLocalItem("test");
}

async function testGetItemAsync() {
  return getLocalItem("test");
}

function testValueOverrideSync() {
  setLocalItem("test", "other-value");
  return getLocalItem("test");
}

async function testValueOverrideAsync(override: string = "other-value") {
  setLocalItem("test", override);
  return getLocalItem("test");
}

describe("itemLocalStorage", () => {
  beforeEach(() => {
    setItemLocalContext(undefined);
  });

  it("gets item context correctly", () => {
    const asyncStorageContext = getItemLocalContext();
    expect(asyncStorageContext.getStore).toBeTruthy();
    expect(asyncStorageContext.getStore()).toBeFalsy();
  });

  it("set item context correctly", () => {
    const someOtherStore = new AsyncLocalStorage<ItemLocalStorage>();
    setItemLocalContext(someOtherStore);
    expect(getItemLocalContext()).toBe(someOtherStore);
  });

  it("stores and retrieves a string value", () => {
    setLocalItem("test", "value");
    const result = getLocalItem("test");
    expect(result).toEqual("value");
  });

  it("stores an object value", () => {
    setLocalItem("test", { object: "value" });
    const result = getLocalItem("test");
    expect(result).toEqual({ object: "value" });
  });

  it("stores an class value", () => {
    setLocalItem("test", new Error("example"));
    const result = getLocalItem("test");
    expect(result.message).toEqual("example");
  });

  it("gets undefined for never set in store", () => {
    const result = getLocalItem("test");
    expect(result).toBeUndefined();
  });

  it("gets undefined for unknown key", () => {
    setLocalItem("test", "value");
    const result = getLocalItem("other");
    expect(result).toBeUndefined();
  });

  it("store multiple values", () => {
    setLocalItem("test1", "value1");
    setLocalItem("test2", "value2");
    expect(getLocalItem("test1")).toEqual("value1");
    expect(getLocalItem("test2")).toEqual("value2");
  });

  it("gets a stored value in lower sync function calls", () => {
    setLocalItem("test", "value");
    const result = testGetItemSync();
    expect(result).toEqual("value");
  });

  it("gets a stored value in lower async function calls", async () => {
    setLocalItem("test", "value");
    const result = await testGetItemAsync();
    expect(result).toEqual("value");
  });

  it("stored value can be overridden in sync call chain", () => {
    setLocalItem("test", "value");
    const result = testValueOverrideSync();
    expect(result).toEqual("other-value");
  });

  it("stored value can be overridden in async call chain", async () => {
    setLocalItem("test", "value");
    const result = await testValueOverrideAsync();
    expect(result).toEqual("other-value");
  });

  it("stores values across sub calls", async () => {
    expect(await testValueOverrideAsync("value1")).toEqual("value1");
    expect(await testValueOverrideAsync("value2")).toEqual("value2");
    expect(testGetItemSync()).toEqual("value2");
    expect(await testGetItemAsync()).toEqual("value2");
  });
});
