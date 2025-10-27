import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  proto,
} from "@whiskeysockets/baileys";
import pino from "pino";
import { Log, q } from "./src/lib/utils.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const usePairingCode = true;
const { version } = await fetchLatestBaileysVersion();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function connectToWhatsApp() {
  Log("info", "Starting hmdfz...");

  const { state, saveCreds } = await useMultiFileAuthState(
    "./session/hmdfz_session"
  );

  const hmdfz = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    version,
    syncFullHistory: true,
    markOnlineOnConnect: false,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return proto.Message.fromObject({});
    },
  });

  if (usePairingCode && !hmdfz.authState.creds.registered) {
    try {
      Log("success", "Please enter your phone number (62).");
      const phoneNumber = await q("> ");
      const code = await hmdfz.requestPairingCode(phoneNumber.trim());
      Log("info", `This is your pairing code: ${code}`);
    } catch (e) {
      Log("error", `Failed to request pairing code: ${e.message}`);
    }
  }

  hmdfz.ev.on("creds.update", saveCreds);

  hmdfz.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "close") {
      Log("danger", "Connection closed, reconnecting...");
      connectToWhatsApp();
    } else if (connection === "open") {
      Log("success", "Connected to WhatsApp!");
    }
  });

  hmdfz.ev.on("messages.upsert", async (m) => {
    if (!m?.messages?.[0]?.message) return;
    try {
      const { default: main } = await import(
        `./src/main.js?update=${Date.now()}`
      );
      await main(hmdfz, m);
    } catch (err) {
      Log("error", `Error in message handler: ${err.message}`);
    }
  });
}

connectToWhatsApp();

const __mainPath = path.join(__dirname, "./src/main.js");
fs.watchFile(__mainPath, () => {
  console.log(
    "Detected change in main.js — new logic will be used on next message"
  );
});
