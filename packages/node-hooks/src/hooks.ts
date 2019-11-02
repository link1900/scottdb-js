import cls, { Namespace } from 'cls-hooked';

export const DEFAULT_CONTEXT_NAMESPACE_ID = 'request-context';
export type Namespace = Namespace;

/**
 * Get (or create if it doesn't exist) the CLS namespace
 * @param namespace String representing the unique namespace for the context.
 * (Defaults to 'request-context')
 */
export const getNamespace = (namespace: string = DEFAULT_CONTEXT_NAMESPACE_ID): Namespace => {
  return cls.getNamespace(namespace) || cls.createNamespace(namespace);
};

/**
 * Get a value for a given key from context
 * @param key
 * @param namespace
 */
export const getFromContext = <T>(key: string, namespace?: string): T | undefined => {
  const ns = getNamespace(namespace);
  if (ns && ns.active) {
    return ns.get(key);
  }
  return undefined;
};

export const setInContext = <T>(key: string, value: any, namespace?: string): T | undefined => {
  const ns = getNamespace(namespace);
  if (ns && ns.active) {
    return ns.set(key, value);
  }
  return undefined;
};
