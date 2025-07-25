import "express";
export interface UserPayload {
  id: string;
  email: string;
}

import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
