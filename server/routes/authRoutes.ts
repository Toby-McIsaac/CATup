import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import User  from "../models/user"; // Adjust the path to your User model
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  checkTokenInDB,
  rotateRefreshToken,
  revokeTokenInDB,
} from "../utils/token"; // Adjust the path to your token utilities
import db from "../db/connection.js";

const authRouter = express.Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err: any) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
});

authRouter.post('/api/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Authenticate the user (validate credentials)
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const userId = user._id.toString();
    const accessToken = await generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    // Send tokens
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json({ accessToken });
  } catch (err: any) {
    res.status(500).json({ message: 'Error logging in', error: err.message });
  }
});

authRouter.post('/api/refresh-token', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const { userId, tokenId } = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

    // Check the token in the database
    const isValid = await checkTokenInDB(userId, tokenId);
    if (!isValid) return res.sendStatus(403);

    // Generate new tokens
    const accessToken = await generateAccessToken(userId);

    // Optionally rotate the refresh token
    const newRefreshToken = await generateRefreshToken(userId);
    await rotateRefreshToken(userId, tokenId, JSON.parse(newRefreshToken).tokenId);

    // Send tokens
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    res.json({ accessToken });
  } catch (err: any) {
    res.sendStatus(403);
  }
});

authRouter.post('/api/logout', async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const { tokenId } = await verify
