import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export async function loadCommands(dir) {
  const commands = new Map();
  const commandList = [];

  if (!fs.existsSync(dir)) {
    throw new Error(`Commands folder not found: ${dir}`);
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".js") && !f.startsWith("_"));

  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileUrl = pathToFileURL(filePath).href + `?update=${Date.now()}`;
    const { default: cmd } = await import(fileUrl);

    if (!cmd?.name) continue;

    commands.set(cmd.name, cmd);
    commandList.push({
      name: cmd.name,
      aliases: cmd.aliases || [],
      description: cmd.description || "Unknown Description",
    });

    if (cmd.aliases) {
      cmd.aliases.forEach((alias) => {
        if (!commands.has(alias)) commands.set(alias, cmd);
      });
    }
  }

  return { commands, commandList };
}
