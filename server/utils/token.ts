import RefreshToken from "../models/refreshToken.js";

export const saveRefreshTokenInDB = async (userId: string, tokenId: string) => {
  try {
    await RefreshToken.create({ userId, tokenId });
  } catch (err) {
    console.error("Error saving refresh token:", err);
    throw new Error("Could not save refresh token");
  }
};

export const checkTokenInDB = async (
  userId: string,
  tokenId: string
): Promise<boolean> => {
  const token = await RefreshToken.findOne({ userId, tokenId });
  return !!token; // Return true if the token exists, false otherwise
};

export const revokeTokenInDB = async (tokenId: string) => {
    try {
        await RefreshToken.findOneAndDelete({ tokenId });
    } catch (err) {
        console.error('Error revoking token:', err);
        throw new Error('Could not revoke token');
    }
};

export const revokeAllTokensForUser = async (userId: string) => {
    try {
        await RefreshToken.deleteMany({ userId });
    } catch (err) {
        console.error('Error revoking all tokens:', err);
        throw new Error('Could not revoke tokens');
    }
};

export const rotateRefreshToken = async (userId: string, oldTokenId: string, newTokenId: string) => {
    try {
        await RefreshToken.findOneAndDelete({ tokenId: oldTokenId });
        await saveRefreshTokenInDB(userId, newTokenId);
    } catch (err) {
        console.error('Error rotating refresh token:', err);
        throw new Error('Could not rotate refresh token');
    }
};
