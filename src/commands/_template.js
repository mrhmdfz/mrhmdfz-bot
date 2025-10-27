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
    await hmdfz.sendMessage(
      sender,
      {
        text: `Halo ${pushName}!\nIni contoh command *${command}*.`,
      },
      { quoted: msg }
    );
  },
};
