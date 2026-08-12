import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};