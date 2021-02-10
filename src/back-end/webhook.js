require("colors");
require("dotenv").config();
const ngrok = require("ngrok");

const WEBHOOK_PATH = `/${process.env.SUB_DOMAIN}/api/v1/chat/webhook`;

(async () => {
  const url = await ngrok.connect({ proto: "http", addr: process.env.PORT });
  console.info(`Webhook URL: ${(url + WEBHOOK_PATH).yellow.bold}`);
})();
