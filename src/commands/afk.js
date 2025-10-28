import fs from "fs";
import config from "../db/config.json" with { type: "json" };

export default {
  name: "afk",
  aliases: ["afkmode"],
  ownerOnly: true,
  description: "Switch AFK mode",
  run: async ({ hmdfz, args, msg, sender }) => {
    if (!args?.length) return await hmdfz.sendMessage(sender, { text: "Type on/off AFK mode" }, { quoted: msg });

    const mode = args[0].toLowerCase();
    const reason = args.slice(1).join(" ");
    if (mode !== "on" && mode !== "off") return await hmdfz.sendMessage(sender, { text: "Invalid option. Please type on/off." }, { quoted: msg });

    config.isBotAFK = mode === "on";
    config.afkReason = mode === "on" ? reason || "not specified" : "";
    if (mode === "on") config.afkNotified = {};
    fs.writeFileSync("./src/db/config.json", JSON.stringify(config, null, 2));

    await hmdfz.sendMessage(sender, { text: `Bot AFK mode has been ${mode === "on" ? "enabled" : "disabled"}.` }, { quoted: msg });
  },
};

export async function handleIncomingMessage({ hmdfz, msg, sender }) {
  if (config.isBotAFK) {
    if (!config.afkNotified[sender]) {
      const reasonText = config.afkReason ? ` Reason: ${config.afkReason}` : "";
      await hmdfz.sendMessage(sender, { text: `Bot is currently AFK.${reasonText}` }, { quoted: msg });
      config.afkNotified[sender] = true;
      fs.writeFileSync("./src/db/config.json", JSON.stringify(config, null, 2));
    }
  }
}
