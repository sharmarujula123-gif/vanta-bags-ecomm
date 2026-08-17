const requiredEnvVariables = [
    "MONGO_URI",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];
  
  if (process.env.NODE_ENV === "production") {
    requiredEnvVariables.push(
      "CLIENT_URL",
      "RAZORPAY_KEY_ID",
      "RAZORPAY_KEY_SECRET",
      "RAZORPAY_WEBHOOK_SECRET"
    );
  }
  
  for (const variable of requiredEnvVariables) {
    if (!process.env[variable]) {
      throw new Error(
        `Missing required environment variable: ${variable}`
      );
    }
  }