const shared = require("../../jest.config");

module.exports = {
  ...shared,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/Country.ts",
    "!src/Country.ts",
    "!src/CountryCode.ts",
    "!src/AustralianState.ts",
    "!src/Timezone.ts",
    "!**/__tests__/**",
  ],
};
