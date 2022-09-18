import { AsyncLocalStorage } from "async_hooks";

export interface ItemLocalStorage {
  items: Map<string, any>;
}

let itemLocalContext: AsyncLocalStorage<ItemLocalStorage> | undefined;

export function getItemLocalContext(): AsyncLocalStorage<ItemLocalStorage> {
  if (!itemLocalContext) {
    itemLocalContext = new AsyncLocalStorage<ItemLocalStorage>();
  }
  return itemLocalContext;
}

export function setItemLocalContext(
  asyncLocalStorage: AsyncLocalStorage<ItemLocalStorage> | undefined
) {
  itemLocalContext = asyncLocalStorage;
}

export function getLocalItem(key: string): any {
  const foundStore = getItemLocalContext().getStore();
  if (!foundStore) {
    return undefined;
  }
  return foundStore.items.get(key);
}

export function setLocalItem(key: string, value: any): boolean {
  const foundStore = getItemLocalContext().getStore();
  if (foundStore !== undefined) {
    foundStore.items.set(key, value);
    return true;
  }
  const items = new Map<string, any>();
  items.set(key, value);
  getItemLocalContext().enterWith({ items });

  return true;
}
