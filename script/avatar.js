const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "avatar",
  version: "1.0.0",
  role: 2, // Admin only
  hasPrefix: false,
  aliases: [],
  description: "Change bot avatar using an image URL or by replying to an image.",
  usage: "avatar <image_url> or reply to an image",
  credits: " Ry",
  cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const threadID = event.threadID;
  const messageID = event.messageID;
  const messageReply = event.messageReply;

  let imageUrl;

  if (messageReply?.attachments?.length > 0) {
    const attachment = messageReply.attachments[0];
    if (attachment.type !== "photo") {
      return api.sendMessage(
        "⚠️ Please reply to an image (photo) only.",
        threadID,
        messageID
      );
    }
    imageUrl = attachment.url;
  } else {
    if (args.length === 0) {
      return api.sendMessage(
        "⚠️ Please provide an image URL or reply to an image.\n📌 Usage: avatar <image_url>",
        threadID,
        messageID
      );
    }
    imageUrl = args[0];
  }

  try {
    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const imagePath = path.join(cacheDir, `avatar_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    const imageStream = fs.createReadStream(imagePath);

    api.changeAvatar(imageStream, "", null, async (err) => {
      await fs.unlink(imagePath).catch(() => {});
      if (err) {
        console.error("❌ Error changing avatar:", err);
        return api.sendMessage(
          "❌ Failed to change avatar. Make sure the image is valid.",
          threadID,
          messageID
        );
      }
      return api.sendMessage("✅ Bot avatar changed successfully!", threadID, messageID);
    });
  } catch (error) {
    console.error("❌ Avatar command error:", error.message);
    return api.sendMessage(
      "❌ Failed to process the image. Make sure it's a valid URL or reply to a valid image.",
      threadID,
      messageID
    );
  }
};