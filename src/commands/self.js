import fs from "fs";
import config from "../db/config.json" with { type: 'json' };

export default {
  name: "self",
  aliases: ["switch"],
  ownerOnly: true,
  description: "Switch public or self mode.",
  run: async ({ hmdfz, args, msg, sender }) => {
    if (!args?.length) {
        await hmdfz.sendMessage(sender, { text: `Type on/off selfmode.` }, { quoted: msg });
        return;
    }
    const selfmode = config.selfmode;
    const mode = args[0].toLowerCase();
    if (mode === "on") {
      if (selfmode) {
        await hmdfz.sendMessage(sender, { text: `Self mode is already enabled.` }, { quoted: msg });
      } else {
        config.selfmode = true;
        fs.writeFileSync("./src/db/config.json", JSON.stringify(config, null, 2));
        await hmdfz.sendMessage(sender, { text: `Self mode has been enabled.` }, { quoted: msg });
      }
    } else if (mode === "off") {
      if (!selfmode) {
        await hmdfz.sendMessage(sender, { text: `Self mode is already disabled.` }, { quoted: msg });
      } else {
        config.selfmode = false;
        fs.writeFileSync("./src/db/config.json", JSON.stringify(config, null, 2));
        await hmdfz.sendMessage(sender, { text: `Self mode has been disabled.` }, { quoted: msg });
      }
    } else {
      await hmdfz.sendMessage(sender, { text: `Invalid option. Please type on/off.` }, { quoted: msg });
    }

  },
};
