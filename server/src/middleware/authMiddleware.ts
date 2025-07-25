import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};
