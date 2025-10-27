import chalk from "chalk";
import readline from "readline";

export async function q(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export function Log(type, msg) {
  const time = new Date().toLocaleTimeString();
  if (type === "info") {
    console.log(chalk.blue(`[${time}] [INFO] ${msg}`));
  } else if (type === "success") {
    console.log(chalk.green(`[${time}] [SUCCESS] ${msg}`));
  } else if (type === "error") {
    console.log(chalk.red(`[${time}] [ERROR] ${msg}`));
  } else {
    console.log(chalk.white(`[${time}] [LOG] ${msg}`));
  }
}
