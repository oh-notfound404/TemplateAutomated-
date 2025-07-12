const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "cdp",
  version: "1.0.1",
  role: 0,
  credits: "developer",
  description: "Send random couple DP from predefined list",
  hasPrefix: false,
  aliases: ["getcdp", "hehem0n"],
  usage: "[cdp]",
  cooldown: 5,
};

const cdpPairs = [
  {
    male: "https://i.ibb.co/Xk5MLTNf/518252442-615354977796047-1342985177787684439-n-jpg-nc-cat-105-ccb-1-7-nc-sid-9f807c-nc-eui2-Ae-FEw6.jpg",
    female: "https://i.ibb.co/dJzc1KjQ/514488363-1052726113653288-2334394293414515641-n-jpg-nc-cat-110-ccb-1-7-nc-sid-9f807c-nc-eui2-Ae-Ged.jpg"
  },
  {
    male: "https://i.ibb.co/cStW3c5n/516526531-2711936169010492-5278392233402174560-n-jpg-stp-dst-jpg-p480x480-tt6-nc-cat-100-ccb-1-7-nc.jpg",
    female: "https://i.ibb.co/MxzrLr0v/516453140-1071511081739183-2471717598490300265-n-jpg-nc-cat-100-ccb-1-7-nc-sid-9f807c-nc-eui2-Ae-Ho.jpg"
  },
  {
    male: "https://i.ibb.co/Vpxf0YGd/517980291-720059070653598-8490968355742584174-n-jpg-stp-dst-jpg-p480x480-tt6-nc-cat-101-ccb-1-7-nc-s.jpg",
    female: "https://i.ibb.co/YBrK66ft/516395899-1074428418088543-915686665137982523-n-jpg-nc-cat-109-ccb-1-7-nc-sid-9f807c-nc-eui2-Ae-F5-N.jpg"
  }
];

module.exports.run = async function ({ api, event }) {
  try {
    api.sendMessage("⌛ Sending a random couple DP, please wait...", event.threadID);

    // Pick a random pair
    const pair = cdpPairs[Math.floor(Math.random() * cdpPairs.length)];

    const imageUrls = { male: pair.male, female: pair.female };
    const imagePaths = [];

    for (const [key, url] of Object.entries(imageUrls)) {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `${key}.jpeg`);
      fs.writeFileSync(filePath, response.data);
      imagePaths.push(filePath);
    }

    const attachments = imagePaths.map(p => fs.createReadStream(p));

    api.sendMessage(
      {
        body: "✨ Here's a couple DP pair for you!",
        attachment: attachments,
      },
      event.threadID,
      () => {
        // Clean up
        imagePaths.forEach(file => fs.unlinkSync(file));
      }
    );
  } catch (err) {
    console.error("CDP Error:", err);
    api.sendMessage("❌ Failed to send couple DP. Try again later.", event.threadID);
  }
};