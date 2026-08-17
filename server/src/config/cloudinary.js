import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImageBuffer = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    const extension = originalName?.split(".").pop()?.toLowerCase();
    const publicIdBase = originalName
      ?.replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "vanta-bags/products",
        public_id: publicIdBase || undefined,
        resource_type: "image",
        format: extension || undefined,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });

export default cloudinary;
