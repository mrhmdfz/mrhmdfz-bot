export default {
  name: "template",
  aliases: ["tmpl", "contoh"],
  description: "Contoh struktur command baru.",
  /**
   * Params:
   * - hmdfz: instance Baileys
   * - msg: pesan mentah dari Baileys
   * - sender: JID pengirim
   * - pushName: nama pengirim
   * - command: nama command yang diketik user
   */
  run: async ({ hmdfz, msg, sender, pushName, command }) => {
    if (!args?.length) {
      const text = `Hello ${pushName}!\nthis is example command template.`;
      await hmdfz.sendMessage(sender, { text }, { quoted: msg });
      return;
    }
    const text = args[0];
    await hmdfz.sendMessage(
      sender,
      {
        text: `Halo ${pushName}!\nIni *${text}*.`,
      },
      { quoted: msg }
    );
  },
};
