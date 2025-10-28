export default {
  name: "help",
  aliases: ["h", "info"],
  ownerOnly: false,
  description: "Show help for a specific command.",
  async run({ hmdfz, msg, sender, commandList, args, prefix = "." }) {
    if (!args?.length) {
      const text = `Type *${prefix}menu* to see all commands.`;
      await hmdfz.sendMessage(sender, { text }, { quoted: msg });
      return;
    }

    const name = args[0].toLowerCase();

    const cmd = commandList.find(
      (c) => c.name === name || (c.aliases && c.aliases.includes(name))
    );

    if (!cmd) {
      await hmdfz.sendMessage(
        sender,
        { text: `Command *${name}* is not available.` },
        { quoted: msg }
      );
      return;
    }

    const aliases = cmd.aliases?.length ? cmd.aliases.join(", ") : "-";
    const description = cmd.description || "Unknown Description.";

    const text = `*Help: ${prefix}${cmd.name}*\n\nAlias: ${aliases}\nDescription: ${description}`;

    await hmdfz.sendMessage(sender, { text }, { quoted: msg });
  },
};
