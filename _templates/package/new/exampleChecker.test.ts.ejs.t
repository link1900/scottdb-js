---
to: packages/<%= name %>/src/__tests__/exampleChecker.test.ts
---

import { exampleCheck } from '../exampleChecker';

describe('exampleChecker', () => {
  describe('#exampleCheck', () => {
    it('test', () => {
      expect(exampleCheck('example')).toEqual(false);
      expect(exampleCheck('actual')).toEqual(true);
    });
  });
});
