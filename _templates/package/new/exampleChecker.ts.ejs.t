---
to: packages/<%= name %>/src/exampleChecker.ts
---
export function exampleCheck(input: string): boolean {
  if (input === 'example') {
    return false
  }
  return true;
}
