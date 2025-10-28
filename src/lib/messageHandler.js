import fs from "fs";
import { Log } from "../lib/utils.js";
import config from "../db/config.json" with { type: "json" };

export async function handleMessage(
  hmdfz,
  m,
  { commands, commandList, prefix = config.prefix }
) {
  const msg = m.messages?.[0];
  if (!msg?.message) return;

  const sender = msg.key.remoteJid;
  const pushName = msg.pushName || "Unknown";

  const body =
    msg.message.conversation ||
    msg.message.extendedTextMessage?.text ||
    msg.message.imageMessage?.caption ||
    msg.message.videoMessage?.caption ||
    "";

  const fromMe = msg.key.fromMe;
  const isOwner = config.ownerNumber === sender;

  if (config.isBotAFK && !config.afkNotified[sender] && !fromMe) {
    const reasonText = config.afkReason ? `${config.afkReason}` : "";
    try {
      await hmdfz.sendPresenceUpdate("composing", sender);
      await hmdfz.sendMessage(sender, { text: `User is AFK, Reason: ${reasonText}` }, { quoted: msg });
      await hmdfz.sendPresenceUpdate("available", sender);
      config.afkNotified[sender] = true;
      fs.writeFileSync("./src/db/config.json", JSON.stringify(config, null, 2));
    } catch (e) {
      console.error("Failed to send AFK message:", e);
    }
  }
  if (!body.startsWith(prefix)) return;

  const parts = body.slice(prefix.length).trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);
  const cmd = commands.get(command);
  Log("info", `Command: ${command} from ${pushName}`);
  if (!cmd) {
    await hmdfz.sendPresenceUpdate("composing", sender);
    await hmdfz.sendMessage(sender, { text: `Unknown command: ${command}` }, { quoted: msg });
    await hmdfz.sendPresenceUpdate("available", sender);
    return;
  }

  if (cmd.ownerOnly && !isOwner) return;
  if (config.selfmode && !fromMe) return;

  try {
    await hmdfz.sendPresenceUpdate("composing", sender);
    await cmd.run({ hmdfz, msg, sender, pushName, command, args, commandList });
    await hmdfz.sendPresenceUpdate("available", sender);
  } catch (err) {
    await hmdfz.sendPresenceUpdate("composing", sender);
    await hmdfz.sendMessage(sender, { text: `Error: ${err.message}` }, { quoted: msg });
    await hmdfz.sendPresenceUpdate("available", sender);
  }
}

