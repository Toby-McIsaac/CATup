import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import {
  checkTokenInDB,
  rotateRefreshToken,
  revokeTokenInDB,
} from "../utils/token";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

const authRouter = express.Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

authRouter.post("/api/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const userId = user._id.toString();
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.json({ accessToken });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

authRouter.post(
  "/api/refresh-token",
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken; // Ensure optional chaining for `cookies`
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing" });
      return;
    }

    try {
      const { userId, tokenId } = await verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );

      // Validate the token in the database
      const isValid = await checkTokenInDB(userId, tokenId);
      if (!isValid) {
        res.status(403).json({ message: "Invalid token" });
        return;
      }

      // Generate new tokens
      const accessToken = await generateAccessToken(userId);
      const newRefreshToken = await generateRefreshToken(userId);

      // Rotate the refresh token in the database
      const newTokenId = JSON.parse(newRefreshToken).tokenId;
      await rotateRefreshToken(userId, tokenId, newTokenId);

      // Set the new refresh token as a cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });

      res.status(200).json({ accessToken });
    } catch (err: any) {
      console.error(err);
      res
        .status(403)
        .json({ message: "Failed to refresh token", error: err.message });
    }
  }
);

authRouter.post(
  "/api/logout",
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(204).json({ message: "No token provided" });
      return;
    }

    try {
      const { tokenId } = await verifyToken(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      );

      // Revoke the token in the database
      await revokeTokenInDB(tokenId);
    } catch (err: any) {
      console.error(err); // Log errors for debugging but don't expose sensitive details
    }

    // Clear the refresh token cookie
    res.clearCookie("refreshToken");
    res.status(204).json({ message: "Logged out successfully" });
  }
);

export default authRouter;
