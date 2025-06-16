const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "removebg",
  version: "1.0.0",
  role: 0,
  credits: "Ry",
  aliases: [],
  usages: "< reply to image >",
  cooldown: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID, messageReply } = event;
  const tempPath = path.join(__dirname, 'cache', `nobg_${Date.now()}.png`);

  if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
    return api.sendMessage("❌ Please reply to an image to remove its background.", threadID, messageID);
  }

  const attachment = messageReply.attachments[0];
  if (attachment.type !== "photo") {
    return api.sendMessage("❌ The replied message must be a photo.", threadID, messageID);
  }

  const imageUrl = attachment.url;
  const apiUrl = `https://rapido.zetsu.xyz/api/remove-background?imageUrl=${encodeURIComponent(imageUrl)}`;

  try {
    api.sendMessage("⌛ Removing background, please wait...", threadID, messageID);

    const response = await axios.get(apiUrl);
    const resultUrl = response.data?.result;

    if (!resultUrl) {
      return api.sendMessage(`❌ Failed to remove background. Reason: ${response.data?.message || 'Unknown error'}`, threadID, messageID);
    }

    // Download the processed image
    const imageData = await axios.get(resultUrl, { responseType: "arraybuffer" });
    fs.ensureDirSync(path.dirname(tempPath));
    fs.writeFileSync(tempPath, Buffer.from(imageData.data, "binary"));

    api.sendMessage({
      body: "✅ Background removed successfully!",
      attachment: fs.createReadStream(tempPath)
    }, threadID, () => fs.unlinkSync(tempPath), messageID);

  } catch (err) {
    console.error("❌ Error removing background:", err);
    api.sendMessage("❌ An error occurred while removing the background. Please try again later.", threadID, messageID);
  }
};