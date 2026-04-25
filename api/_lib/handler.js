const { applyCors, handlePreflight } = require("./cors");

function withApi(handler, options = {}) {
  const allowedMethods = options.allowedMethods || ["GET"];

  return async function apiHandler(req, res) {
    applyCors(req, res);

    if (handlePreflight(req, res)) {
      return;
    }

    if (!allowedMethods.includes(req.method)) {
      res.setHeader("Allow", allowedMethods.join(", "));
      return res.status(405).json({
        error: `Method ${req.method} Not Allowed`,
      });
    }

    try {
      return await handler(req, res);
    } catch (error) {
      const status = Number(error?.status) || 500;

      if (status >= 500) {
        console.error("[api]", error);
      }

      return res.status(status).json({
        error: error?.message || "Internal Server Error",
        details: error?.details || null,
      });
    }
  };
}

module.exports = { withApi };
