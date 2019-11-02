export function runScript(scriptFunction: () => Promise<any>) {
  scriptSetup().then(() => {
    scriptFunction()
      .then(() => {
        process.exit(0);
      })
      .catch(err => {
        process.exit(1);
      });
  });
}

async function scriptSetup() {
  process.env.EXECUTION_ENVIRONMENT = 'local-dev';
}
