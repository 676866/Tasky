import "express";
import { User } from "@prisma/client";
 
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
