import { errorLogger } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  // Log details about the error
  errorLogger.error({
    event: "Global Error",
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    user: req.user?.email || "guest",
  });

  // Never expose internal error details to the client
  res.status(err.statusCode || 500).json({
    success: false,
    message: "Server Error",
  });
};

export default errorHandler;
