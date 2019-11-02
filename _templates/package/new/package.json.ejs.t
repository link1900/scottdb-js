---
to: packages/<%= name %>/package.json
---
{
  "name": "@link1900/<%= name %>",
  "version": "0.0.1",
  "description": "<%= h.changeCase.sentenceCase(name) %>",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "author": "Scott Brown <link1900@gmail.com>",
  "license": "MIT",
  "repository": "git@github.com:link1900/link1900.git",
  "publishConfig": {
    "access": "public"
  },
  "sideEffects": false,
  "scripts": {
    "lint": "tsc --noEmit",
    "prebuild": "rm -rf lib/",
    "build": "tsc",
    "test": "jest"
  },
  "directories": {
    "lib": "lib"
  },
  "files": [
    "lib"
  ],
  "devDependencies": {
  },
  "dependencies": {
  }
}
