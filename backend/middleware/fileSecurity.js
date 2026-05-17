import fs from "fs";
import crypto from "crypto";
import util from "util";
import { exec } from "child_process";
import { fileTypeFromBuffer } from "file-type";
import os from "os";
import path from "path";

const execPromise = util.promisify(exec);

// Allowed image MIME types
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
// Maximum allowed size = 5MB
const MAX_SIZE = 5 * 1024 * 1024;

// Optional: customize ClamAV binary path
const CLAM_PATH = process.env.CLAMSCAN_PATH || "clamscan";

export const validateAndScanUploads = async (req, res, next) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });
    }

    // Convert multer files into a flat list
    const allFiles = Object.values(req.files).flat();

    for (const file of allFiles) {
      //
      // 1️⃣ SIZE VALIDATION
      //
      if (file.size > MAX_SIZE) {
        return res.status(400).json({
          success: false,
          message: "File too large (max 5MB)",
        });
      }

      //
      // 2️⃣ MIME VALIDATION (real content, not extension)
      //
      const detected = await fileTypeFromBuffer(file.buffer);
      if (!detected || !ALLOWED_MIME.includes(detected.mime)) {
        return res.status(400).json({
          success: false,
          message: "Invalid file type. Only JPG, PNG, WEBP allowed.",
        });
      }

      //
      // 3️⃣ MALWARE SCAN (ClamAV) - but safe if missing
      //
      const tempName = `${crypto.randomBytes(16).toString("hex")}-${file.originalname}`;

      // ✔ Use OS temp directory (works on Windows/Mac/Linux)
      const tempDir = os.tmpdir();
      const tempPath = path.join(tempDir, tempName);

      // Save file temporarily
      await fs.promises.writeFile(tempPath, file.buffer);

      try {
        // Try scanning the file
        const { stdout } = await execPromise(`"${CLAM_PATH}" "${tempPath}"`);

        if (stdout.includes("FOUND")) {
          return res.status(400).json({
            success: false,
            message: "Upload blocked: file appears to contain malware.",
          });
        }

      } catch (scanErr) {
        // If ClamAV is not installed → DO NOT crash
        console.warn("ClamAV scan failed or not installed. Skipping scan.");
        console.warn(scanErr.message);
      } finally {
        // Remove the temp file always
        await fs.promises.unlink(tempPath).catch(() => {});
      }
    }

    // All files passed validation → continue
    next();

  } catch (err) {
    console.error("File security error:", err);
    return res
      .status(500)
      .json({ success: false, message: "File security check failed" });
  }
};
