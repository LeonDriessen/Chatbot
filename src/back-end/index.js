require("colors");
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const expressRateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const db = require("./db");

const errorHandler = require("./middleware/error");
const chatHandler = require("./handlers/chat");
const webhookHandler = require("./handlers/webhook");
const welcomeHandler = require("./handlers/welcome");
const authenticateHandler = require("./handlers/authenticate");
const preferenceSessionHandler = require("./handlers/preferenceSession");
const updateSonaIDHandler = require("./handlers/sonaID");

(async () => {
  const app = express();

  app.use(morgan("dev"));

  // MongoDB atlas
  await db.connect();

  // Body parser
  app.use(express.json());

  // Cookie parser
  app.use(cookieParser());

  // Security headers
  app.use(helmet());

  // Xss prevention
  app.use(xssClean());

  // Prevent http param pollution
  app.use(hpp());

  // CORS
  app.use(cors());

  const router = express.Router();

  // Set static folder
  router.use(express.static(path.join(__dirname, "/../../dist")));

  router.get("/api/v1/test", (req, res) => {
    console.log(test);
    res.sendStatus(200);
  });

  router.post("/api/v1/authenticate", authenticateHandler);
  router.post("/api/v1/chat", chatHandler);
  router.post("/api/v1/newPreferenceSession", preferenceSessionHandler);
  router.post("/api/v1/updateSonaID", updateSonaIDHandler);
  router.get("/api/v1/chat/welcome", welcomeHandler);
  router.post("/api/v1/chat/webhook", webhookHandler);

  router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/../../dist/index.html"));
  });

  router.use(errorHandler);

  app.use(`/${process.env.SUB_DOMAIN}`, router);

  const PORT = process.env.PORT || 3000;

  const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

  process.on("unhandledRejection", (error, promise) => {
    console.info(`Error: ${error.message}`.red);
    server.close(() => {
      process.exit(1);
    });
  });
})();
