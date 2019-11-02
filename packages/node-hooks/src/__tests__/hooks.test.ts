import { getFromContext, getNamespace, setInContext } from '../hooks';

describe('hooks', () => {
  describe('#getNamespace', () => {
    it('creates a namespace with provided name', () => {
      const namespace = getNamespace('someNamespace');
      // @ts-ignore
      expect(namespace.name).toEqual('someNamespace');
    });

    it('creates a namespace with a default id', () => {
      const namespace = getNamespace();
      // @ts-ignore
      expect(namespace.name).toEqual('request-context');
    });

    it('gets the same namespace when it is already created', () => {
      const namespace = getNamespace();
      const getSameNamespace = getNamespace();
      expect(namespace).toEqual(getSameNamespace);
    });
  });

  describe('#getFromContext', () => {
    it('gets a key after setting it', () => {
      const key = 'someKey';
      const value = 'someValue';
      const namespace = getNamespace();
      namespace.run(() => {
        setInContext(key, value);
        const foundValue = getFromContext(key);
        expect(foundValue).toEqual(value);
      });
    });

    it('gets null when no context is found', () => {
      const key = 'someKey';
      const value = 'someValue';
      setInContext(key, value);
      const foundValue = getFromContext(key);
      expect(foundValue).toBeFalsy();
    });

    it('set a gets a key unique to the namespace context', () => {
      const key = 'someKey';
      const value = 'someValue';
      const namespace = getNamespace();
      namespace.run(() => {
        setInContext(key, value);
        const foundValue = getFromContext(key);
        expect(foundValue).toEqual(value);
      });
      namespace.run(() => {
        const foundValue = getFromContext(key);
        expect(foundValue).toBeFalsy();
      });
    });
  });
});
