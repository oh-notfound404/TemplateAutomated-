const axios = require('axios');

module.exports.config = {
  name: "art",
  version: "1.0.0",
  credits: "developer",
  description: "Generates AI art from a given prompt.",
  hasPrefix: false,
  cooldown: 5,
  aliases: ["aiart", "genart"],
};

module.exports.run = async function ({ api, event, args }) {
  if (!args || args.length === 0) {
    return api.sendMessage(
      "Please provide a prompt to generate art.\n\nExample: art A cat with a collar and the tag is Ace",
      event.threadID,
      event.messageID
    );
  }

  const prompt = args.join(' ');
  const imageUrl = `https://mademoiselle-rrest-apis.onrender.com/api/art?prompt=${encodeURIComponent(prompt)}`;

  try {
    const imageStream = await axios.get(imageUrl, { responseType: 'stream' });

    return api.sendMessage({
      body: `Here is your art for: "${prompt}"`,
      attachment: imageStream.data
    }, event.threadID);
  } catch (error) {
    console.error('Art generation error:', error.message);
    return api.sendMessage(
      "Error: Failed to generate art. Please try again later.",
      event.threadID,
      event.messageID
    );
  }
};