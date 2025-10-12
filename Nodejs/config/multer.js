import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) {
fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, uploadDir);
},
filename: function (req, file, cb) {
const ext = path.extname(file.originalname);
cb(null, `${Date.now()}-${file.originalname}`);
},
});

const upload = multer({
storage,
limits: { fileSize: 5 * 1024 * 1024 },
fileFilter: function (req, file, cb) {
const types = ["image/jpeg", "image/png", "image/jpg"];
if (types.includes(file.mimetype)) {
cb(null, true);
} else {
cb(new Error("Only JPG, PNG allowed"), false);
}
},
});

export default upload;