import util from "util";
import { Log } from "./utils.js";
import { loadCommands } from "./loadCommands.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandPath = path.join(__dirname, "../commands");

export async function handleMessage(hmdfz, m, { prefix = "." }) {
  const msg = m.messages?.[0];
  if (!msg?.message) return;

  const { commands, commandList } = await loadCommands(commandPath);

  const body =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    "";
  const sender = msg.key.remoteJid;
  const pushName = msg.pushName || "Unknown";

  if (body.startsWith("> ")) {
    const code = body.slice(1).trim();
    try {
      let evaled = eval(code);
      if (typeof evaled !== "string") evaled = util.inspect(evaled);
      await hmdfz.sendMessage(sender, { text: `${evaled}` }, { quoted: msg });
    } catch (err) {
      await hmdfz.sendMessage(
        sender,
        { text: `err:\n${err.message}` },
        { quoted: msg }
      );
    }
    return;
  }

  if (!body.startsWith(prefix)) return;

  const parts = body.slice(prefix.length).trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  const cmd = commands.get(command);

  Log("info", `Command received: ${command} from ${pushName}`);

  if (!cmd) {
    await hmdfz.sendMessage(
      sender,
      { text: `Unknown command: ${command}` },
      { quoted: msg }
    );
    return;
  }

  try {
    await cmd.run({ hmdfz, msg, sender, pushName, command, args, commandList });
    Log("success", `Executed command: ${command}`);
  } catch (err) {
    Log("error", err);
    await hmdfz.sendMessage(sender, { text: `Error: ${err.message}` });
  }
}
