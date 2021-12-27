const sharedConfig = require("../../jest.config");

module.exports = {
  ...sharedConfig,
  setupFilesAfterEnv: ["./src/__tests__/envSetup.ts"],
};
