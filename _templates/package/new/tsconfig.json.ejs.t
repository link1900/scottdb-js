---
to: packages/<%= name %>/tsconfig.json
---
{
  "extends": "../../tsconfig.json",

  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "**/__tests__/*"],

  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib",
    "declarationDir": "lib"
  }
}
