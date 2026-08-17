import { Readable } from "node:stream";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "vanta-bags/products",
        resource_type: "image",
        use_filename: true,
        unique_filename: true,
        filename_override: originalName.replace(/\.[^.]+$/, ""),
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    Readable.from(buffer).pipe(stream);
  });

export const uploadProductImages = async (req, res) => {
  if (!req.files?.length) {
    return res.status(400).json({
      success: false,
      message: "Please select at least one product image.",
    });
  }

  const urls = await Promise.all(
    req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, file.originalname)
    )
  );

  return res.status(201).json({
    success: true,
    message: "Product images uploaded successfully",
    data: {
      images: urls,
    },
  });
};
