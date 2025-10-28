import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import config from "../db/config.json" with { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

async function downloadFile(url, tmpName, ext) {
  const filepath = path.join(tmpDir, `${tmpName}.${ext}`);
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 60000 });
  fs.writeFileSync(filepath, res.data);
  return filepath;
}

function cleanIGUrl(url) {
  try {
    const u = new URL(url);
    return `https://www.instagram.com${u.pathname}`;
  } catch {
    return url;
  }
}

export default {
  name: "ig",
  aliases: ["igdownload", "igdl"],
  ownerOnly: false,
  description: "Download Instagram video/reels/image",
  run: async ({ hmdfz, msg, args, sender }) => {
    if (!args?.length)
      return await hmdfz.sendMessage(sender, { text: "Usage: .ig <instagram_url>" }, { quoted: msg });

    const url = cleanIGUrl(args[0]);
    let mediaList;

    try {
      const { data } = await axios.get("https://api.itsrose.net/instagram/get_content", {
        params: { url },
        headers: { Authorization: `Bearer ${config.itsrose}` },
        timeout: 15000,
      });

      if (!data?.status || !data?.result?.contents?.length)
        throw new Error("No media found");

      mediaList = data.result;
    } catch (err) {
      console.error("Instagram API error:", err);
      return await hmdfz.sendMessage(sender, { text: "Failed to fetch Instagram media." }, { quoted: msg });
    }
    const caption = `${mediaList.title}`.trim();
    await hmdfz.sendMessage(sender, { text: `Found ${mediaList.contents.length} media item(s). Downloading...` }, { quoted: msg });

    for (const [i, media] of mediaList.contents.entries()) {
      try {
        const tmpName = `ig_${Date.now()}_${i}`;
        const filepath = await downloadFile(media.url, tmpName, media.ext.toLowerCase());

        if (media.type === "mp4")
          await hmdfz.sendMessage(sender, { video: fs.readFileSync(filepath), caption }, { quoted: msg });
        else if (media.type === "jpg")
          await hmdfz.sendMessage(sender, { image: fs.readFileSync(filepath), caption }, { quoted: msg });
        else
          await hmdfz.sendMessage(sender, { text: `Unknown media type. Direct link:\n${media.url}` }, { quoted: msg });

        fs.unlinkSync(filepath);
      } catch (err) {
        console.error(`Failed to send media ${i + 1}:`, err);
        await hmdfz.sendMessage(sender, { text: `Failed to send media ${i + 1}. Direct link:\n${media.url}` }, { quoted: msg });
      }
    }
  },
};
