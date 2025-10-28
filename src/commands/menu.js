import config from "../db/config.json" with { type: 'json' };

export default {
  name: "menu",
  aliases: ["commands"],
  description: "Show the commands menu.",

  run: async ({ hmdfz, msg, sender, commandList }) => {
    if (!commandList?.length) {
      await hmdfz.sendMessage(
        sender,
        { text: "There is not command available." },
        { quoted: msg }
      );
      return;
    }

    let text = `*${config.botName}*\n\n`;

    const commandListArray = Array.from(commandList.values());
    const ownerCommands = commandListArray.filter(cmd => cmd.ownerOnly);
    const userCommands = commandListArray.filter(cmd => !cmd.ownerOnly);

    if (userCommands.length) {
      text += "*Public:*\n";
      for (const cmd of userCommands) {
        text += `• ${config.prefix}${cmd.name} (${cmd.aliases})\n`;
      }
    }

    if (ownerCommands.length) {
      text += "*Owner:*\n";
      for (const cmd of ownerCommands) {
        text += `• ${config.prefix}${cmd.name} (${cmd.aliases})\n`;
      }
      text += "\n";
    }

    text += "Type .help <command> for detail.";

    await hmdfz.sendMessage(sender, { text }, { quoted: msg });
  },
};
