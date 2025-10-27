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

    let text = "*MRHMDFZ BOT*\n\n";
    for (const cmd of commandList) {
      const alias = cmd.aliases.length ? ` (${cmd.aliases.join(", ")})` : "";
      text += `• .${cmd.name}${alias}\n  ${cmd.description}\n\n`;
    }

    text += "Type .help <command> for detail.";

    await hmdfz.sendMessage(sender, { text }, { quoted: msg });
  },
};
