module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testMatch: ["<rootDir>/src/**/__tests__/**/*.test.ts?(x)"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  globalSetup: "../../scripts/test/testSetup.ts",
  setupFilesAfterEnv: ["../../scripts/test/testSetupPostEnv.ts"],
  globalTeardown: "../../scripts/test/testTeardown.ts",
  globals: {
    __DEV__: true,
  },
  collectCoverageFrom: ["src/*.{js,jsx,ts,tsx}", "src/**/*.{js,jsx,ts,tsx}", "!**/__tests__/**"],
  coveragePathIgnorePatterns: ["index.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "text-summary", "lcov", "html"],
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
    },
  },
};
