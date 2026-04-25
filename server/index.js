const { createApp } = require("./app");
const { env } = require("./config/env");
const { connectDatabase } = require("./config/db");

async function startServer() {
  const app = createApp();
  const dbState = await connectDatabase();

  if (!dbState.connected) {
    console.log("[server] database not connected:", dbState.reason);
  }

  app.listen(env.port, () => {
    console.log(`[server] listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error("[server] failed to start", error);
  process.exit(1);
});
