import { downloadMediaMessage } from "@whiskeysockets/baileys";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { Log } from "../lib/utils.js";

export default {
  name: "sticker",
  aliases: ["stiker", "s"],
  ownerOnly: false,
  description: "Create a sticker from an image.",

  run: async ({ hmdfz, msg, sender, pushName }) => {
    const quoted =
      msg.message.imageMessage || msg.message.videoMessage
        ? msg
        : msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      await hmdfz.sendMessage(sender, {
        text: "Send image with caption .sticker",
      });
      return;
    }

    if (quoted.videoMessage) {
      await hmdfz.sendMessage(sender, {
        text: "Video is not supported.",
      });
      return;
    }

    try {
      const buffer = await downloadMediaMessage(
        { message: quoted },
        "buffer",
        {},
        { logger: hmdfz.logger }
      );

      const sticker = new Sticker(buffer, {
        pack: "mrhmdfz",
        author: "hmdfz",
        type: StickerTypes.FULL,
        quality: 70,
      });

      const stickerBuffer = await sticker.build();
      await hmdfz.sendMessage(
        sender,
        { sticker: stickerBuffer },
        { quoted: msg }
      );
      Log("success", `Sticker sent by ${pushName}`);
    } catch (err) {
      await hmdfz.sendMessage(sender, {
        text: `Error sticker: ${err.message}`,
      });
      Log("error", err);
    }
  },
};
