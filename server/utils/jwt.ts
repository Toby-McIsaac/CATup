import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";
import { saveRefreshTokenInDB } from "./token";

type VerifiedToken = {
  userId: string;
  tokenId: string;
};

export const generateAccessToken = async (userId: string) => {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("15m")
    .sign(new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET));
};

export const generateRefreshToken = async (userId: string) => {
  const tokenId = uuidv4(); // Unique token identifier
  const refreshToken = await new SignJWT({ userId, tokenId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET));

  // Save tokenId to the database for revocation handling
  await saveRefreshTokenInDB(userId, tokenId);

  return refreshToken;
};

export const verifyToken = async (token: string, secret: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    ) as { payload: VerifiedToken };
    return payload; // Contains userId and tokenId
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
