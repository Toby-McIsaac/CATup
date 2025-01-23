import { jwtVerify } from "jose";

const verifyToken = async (token: string, secret: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    return payload; // Contains userId and tokenId
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
