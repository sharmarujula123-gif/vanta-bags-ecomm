import multer from "multer";

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(
    new multer.MulterError(
      "LIMIT_UNEXPECTED_FILE",
      "Only JPG, JPEG, PNG and WEBP images are allowed"
    )
  );
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    files: 10,
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
