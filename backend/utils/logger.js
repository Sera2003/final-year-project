import winston from "winston";
import fs from "fs";

// Ensure logs folder exists
if (!fs.existsSync("logs")) {
  fs.mkdirSync("logs");
}

// Security logger (info + warn + error)
export const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/security.log" }),
    new winston.transports.Console()
  ],
});

// Error logger (errors only)
export const errorLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log" }),
    new winston.transports.Console()
  ],
});
