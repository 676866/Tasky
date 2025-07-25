import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

//  Register
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password } = req.body;

  if (!firstName || !lastName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // for checking if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    // Creating user
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return res
      .status(500)
      .json({ message: "Registration failed", error: String(error) });
  }
};
//ligin in
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res
      .status(500)
      .json({ message: "Login failed", error: String(error) });
  }
};
