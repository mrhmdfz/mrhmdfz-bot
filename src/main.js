import path from "path";
import { fileURLToPath } from "url";
import { loadCommands } from "./lib/loadCommands.js";
import { handleMessage } from "./lib/messageHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandPath = path.join(__dirname, "commands");
const { commands, commandList } = await loadCommands(commandPath);

export default async (hmdfz, m) => {
  await handleMessage(hmdfz, m, { commands, commandList });
};
