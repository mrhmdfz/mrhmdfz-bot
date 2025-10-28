import util from "util";

export default {
  name: "eval",
  aliases: ["e"],
  ownerOnly: true,
  description: "Evaluate JavaScript code dynamically.",
  async run({ hmdfz, msg, sender, args }) {
    if (!args?.length) {
      await hmdfz.sendMessage(
        sender,
        {
          text: "Usage: .e <JavaScript code>",
        },
        { quoted: msg }
      );
      return;
    }

    const code = args.join(" ");
    try {
      let evaled = eval(code);
      if (typeof evaled !== "string") evaled = util.inspect(evaled);

      await hmdfz.sendMessage(
        sender,
        {
          text: `Result:\n${evaled}`,
        },
        { quoted: msg }
      );
    } catch (err) {
      await hmdfz.sendMessage(
        sender,
        {
          text: `Error:\n${err.message}`,
        },
        { quoted: msg }
      );
    }
  },
};
