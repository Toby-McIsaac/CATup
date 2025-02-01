import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/user";
import { checkTokenInDB, revokeTokenInDB } from "../utils/tokens/token";
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokens/jwt";

const authRouter = express.Router();

authRouter.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Username or password already exists" });
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

authRouter.post("/auth/login", async (req: Request, res: Response) => {
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
      secure: process.env.NODE_ENV === "production", // Enable secure flag only in production
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

authRouter.post(
  "/auth/access-token",
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
        res.status(401).json({ message: "Invalid or expired refresh token" });
        return;
      }

      // Generate new token
      const accessToken = await generateAccessToken(userId);

      res.status(200).json({ accessToken });
    } catch (err: any) {
      console.error(err);
      res
        .status(401)
        .json({ message: "Failed to refresh token", error: err.message });
    }
  }
);

authRouter.post(
  "/auth/logout",
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
      const success = await revokeTokenInDB(tokenId);

      if (!success) {
        res.status(500).json({ message: "Failed to revoke refresh token" });
        return;
      }

      // Clear the refresh token cookie on logout
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    } catch (err: any) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error during logout", error: err.message });
      return;
    }
  }
);

export default authRouter;
