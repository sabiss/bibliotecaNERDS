import multer from "multer";
import path from "path";
import slugify from "slugify";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const slug = slugify(file.originalname, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    });
    const filename = `${timestamp}-${slug}${path.extname(file.originalname)}`;
    const url = path.posix.join("uploads", filename); // Use path.posix.join para garantir barras normais
    cb(null, filename);
  },
});

const upload = multer({ storage });

export { upload };
