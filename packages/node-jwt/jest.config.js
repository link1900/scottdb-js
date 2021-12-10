const shared = require("../../jest.config");

module.exports = {
  ...shared,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/jwkHelper.ts",
    "!src/jwtHelper.ts",
    "!**/__tests__/**",
  ],
};
