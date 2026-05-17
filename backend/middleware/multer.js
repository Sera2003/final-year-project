// middleware/multer.js or wherever you're defining it
import multer from "multer";

const storage = multer.memoryStorage(); // ✅ store files in memory

const upload = multer({ storage });

export default upload;
