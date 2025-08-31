import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/api.types";
import { USER_ROLES } from "../constants";
import { auth } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | null;
        role: (typeof USER_ROLES)[keyof typeof USER_ROLES] | null;
      };
    }
  }
}

//authenicate middleware
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await auth.api.getSession({
    headers: req.headers as any,
  });
  req.user = { id: session?.user.id || null, role: session?.user.role || null };
  next();
};

//authorize middleware
export const authorize = (
  roles: (typeof USER_ROLES)[keyof typeof USER_ROLES][]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });
    const userRole = session?.user.role;
    if (!userRole || !roles.includes(userRole)) {
      const response: ApiResponse = {
        success: false,
        message: "Authorization failed. Insufficient permissions.",
        data: null,
        errors: { details: { message: "Insufficient permissions." } },
      };
      return res.status(403).json(response);
    }
    next();
  };
};
