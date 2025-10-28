export default {
  name: "speed",
  aliases: ["ping"],
  ownerOnly: false,
  description: "Check the bot's response speed.",

  run: async ({ hmdfz, msg, sender }) => {
    const speed = Date.now() - msg.messageTimestamp * 1000;
    await hmdfz.sendMessage(
      sender,
      { text: `Speed: ${speed} ms` },
      { quoted: msg }
    );
  },
};
