const chalk = require("chalk");

export function logError(msg) {
  const log = console.error;
  log(chalk.yellowBright(msg));
  log();
}
