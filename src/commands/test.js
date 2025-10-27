export default {
  name: "test",
  aliases: ["t"],
  description: "Testing prompt.",

  run: async ({ hmdfz, sender }) => {
    const nomor_orang = "6281226246354";
    await hmdfz.sendMessage(
      sender,
      {
        text: `Ini adalah pesan uji coba.`,
      },
      {
        quoted: {
          key: {
            remoteJid: nomor_orang + "@s.whatsapp.net",
            fromMe: false,
            id: "FAKE_MESSAGE_ID",
          },
          message: {
            conversation: "Testing",
          },
        },
      }
    );
  },
};
