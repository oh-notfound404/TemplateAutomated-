const axios = require('axios');

module.exports.config = {
  name: 'catfact',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: [],
  description: 'Fetch a random cat fact',
  usage: 'catfact',
  credits: 'developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event }) {
  const threadID = event.threadID;
  const messageID = event.messageID;

  api.sendMessage('Fetching a cat fact...', threadID, messageID);

  try {
    const res = await axios.get('https://xvi-rest-api.vercel.app/api/catfact');
    const fact = res.data.fact;

    if (!fact) {
      return api.sendMessage("Sorry, couldn't find a cat fact.", threadID, messageID);
    }

    const message = `Cat Fact:\n\n${fact}`;
    return api.sendMessage(message, threadID, messageID);
  } catch (err) {
    console.error('Catfact error:', err.message);
    return api.sendMessage(`Error: ${err.message}`, threadID, messageID);
  }
};