export default async function testSetup() {
  console.log("Running global test setup");
  process.env.EXECUTION_ENVIRONMENT = "local-test";
}
