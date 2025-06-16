const axios = require("axios");

module.exports.config = {
  name: "bible",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: [],
  description: "Fetch a Bible verse!",
  usage: "bible",
  credits: "Dale Mekumi",
  cooldown: 3,
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  // Notify user it's fetching
  await api.sendMessage("📖 Fetching a Bible verse...", threadID, messageID);

  try {
    const response = await axios.get("https://mademoiselle-rrest-apis.onrender.com/api/bibleverse");
    const verse = response.data;

    if (!verse) {
      return api.sendMessage(
        "🥺 Sorry, I couldn't find a Bible verse.",
        threadID,
        messageID
      );
    }

    return api.sendMessage(
      `📜 Bible Verse\n\n"${verse}"`,
      threadID,
      messageID
    );
  } catch (error) {
    console.error("Bible command error:", error.message);
    return api.sendMessage(
      `❌ An error occurred: ${error.message}`,
      threadID,
      messageID
    );
  }
};