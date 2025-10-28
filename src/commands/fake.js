export default {
  name: "fake",
  aliases: ["f"],
  ownerOnly: true,
  description: "Fake a quoted message.",
  run: async ({ hmdfz, sender, args }) => {
    if (!args?.length) {
      await hmdfz.sendMessage(sender, {
        text: `Usage: .fake target|your_msg|quoted_msg`,
      });
      return;
    }
    const senderTarget = args[0].split("|")[0] + "@s.whatsapp.net";
    const messageText = args[0].split("|")[1] || "Hello!";
    const messageQuote = args[0].split("|")[2] || "Hello!";
    const quotedTarget = senderTarget;

    await hmdfz.sendMessage(
      senderTarget,
      {
        text: messageText,
      },
      {
        quoted: {
          key: {
            remoteJid: quotedTarget,
            fromMe: false,
            id: "FAKE_MESSAGE_ID",
          },
          message: {
            conversation: messageQuote,
          },
        },
      }
    );
  },
};
