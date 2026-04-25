const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
const { errorHandler } = require("./middleware/errorHandler");
const { env } = require("./config/env");

function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsAllowedOrigin,
    }),
  );
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRoutes);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
