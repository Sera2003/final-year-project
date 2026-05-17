import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const FASHN_RUN_URL = "https://api.fashn.ai/v1/run";
const FASHN_STATUS_URL = "https://api.fashn.ai/v1/status";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKEND_DIR = path.join(__dirname, "..");

function bufferToDataUrl(buffer, mimeType) {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function localStaticPathFromUrl(value) {
  let pathname = value;

  try {
    pathname = new URL(value).pathname;
  } catch (_) {
    // value is already a relative path like /users/... or /products/...
  }

  const decodedPathname = decodeURIComponent(pathname);

  if (decodedPathname.startsWith("/users/")) {
    return path.join(BACKEND_DIR, "bin", decodedPathname);
  }

  if (decodedPathname.startsWith("/products/")) {
    const fileName = decodedPathname.split("/products/")[1];
    return path.join(BACKEND_DIR, "bin", "products", fileName);
  }

  return null;
}

async function imageInputValue(value) {
  if (!value) return value;
  if (value.startsWith("data:image/")) return value;

  const localPath = localStaticPathFromUrl(value);
  if (!localPath) return value;

  const resolvedPath = path.resolve(localPath);
  const resolvedBackend = path.resolve(BACKEND_DIR);

  if (!resolvedPath.startsWith(resolvedBackend + path.sep)) {
    throw new Error("Invalid local image path");
  }

  const buffer = await fs.promises.readFile(resolvedPath);
  return bufferToDataUrl(buffer, getMimeType(resolvedPath));
}

function toRawGithubUrl(url) {
  if (!url) return url;
  if (url.includes("raw.githubusercontent.com")) return url;
  if (url.includes("github.com") && url.includes("/blob/")) {
    return url
      .replace("https://github.com/", "https://raw.githubusercontent.com/")
      .replace("/blob/", "/");
  }
  return url;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export const runTryOn = async (req, res) => {
  try {
    if (!process.env.FASHN_API_KEY) {
  return res.status(500).json({ success: false, message: "FASHN_API_KEY missing in backend .env" });
}

    const file = req.file;
    const bodyUserImageUrl = String(req.body.userImageUrl || "").trim();
    let garmentImageUrl = String(req.body.productImageUrl || "").trim();

    if (!file && !bodyUserImageUrl) {
      return res.status(400).json({ success: false, message: "User image is required" });
    }
    if (!garmentImageUrl) {
      return res.status(400).json({ success: false, message: "productImageUrl is required" });
    }

    garmentImageUrl = toRawGithubUrl(garmentImageUrl);

    let modelImageValue = "";
    if (file) {
      modelImageValue = bufferToDataUrl(file.buffer, file.mimetype);
    } else {
      modelImageValue = await imageInputValue(bodyUserImageUrl);
    }

    garmentImageUrl = await imageInputValue(garmentImageUrl);

    // 1) Start job
    const submitPayload = {
      model_name: "tryon-v1.6",
      inputs: {
        model_image: modelImageValue,
        garment_image: garmentImageUrl,
        category: "auto",
        segmentation_free: true,
        moderation_level: "permissive",
        garment_photo_type: "auto",
        mode: "quality",
        num_samples: 1,
        output_format: "png",
      },
    };

    const submitResp = await fetch(FASHN_RUN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
      },
      body: JSON.stringify(submitPayload),
    });

    const submitData = await submitResp.json();

    if (!submitResp.ok || !submitData?.id) {
      return res.status(400).json({
        success: false,
        message: submitData?.message || submitData?.error || "FASHN submit failed",
        details: submitData,
      });
    }

    const predictionId = submitData.id;

    // 2) Poll status
    for (let i = 0; i < 40; i++) {
      await sleep(1000);

      const statusResp = await fetch(`${FASHN_STATUS_URL}/${predictionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
        },
      });

      const statusData = await statusResp.json();

      if (!statusResp.ok) {
        return res.status(400).json({
          success: false,
          message: statusData?.message || "FASHN status failed",
          details: statusData,
        });
      }

      if (statusData.status === "completed") {
        const outputUrl = statusData.output?.[0];
        if (!outputUrl) {
          return res.status(500).json({
            success: false,
            message: "No output image returned",
            details: statusData,
          });
        }

        return res.json({
          success: true,
          resultImageUrl: outputUrl,
          id: predictionId,
        });
      }

      if (statusData.status === "failed") {
        return res.status(400).json({
          success: false,
          message: statusData?.error?.message || "Try-on failed",
          details: statusData,
        });
      }
    }

    return res.status(408).json({
      success: false,
      message: "Try-on timed out. Please try again.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error in try-on" });
  }
};
