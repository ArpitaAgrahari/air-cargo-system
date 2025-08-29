import { Request, Response, NextFunction } from 'express';
import { auth } from './auth';
import { ApiResponse } from '../types/api.types';
import { UserRole } from '@prisma/client';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}


//authenicate middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed. No token provided.',
      data: null,
      errors: { details: { message: 'No token provided.' } },
    };
    return res.status(401).json(response);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = await auth.verifyToken(token);
    req.user = { id: payload.userId, role: payload.userRole }; 
    next();
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed. Invalid token.',
      data: null,
      errors: { details: { message: 'Invalid token.' } },
    };
    return res.status(401).json(response);
  }
};


//authorize middleware
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        message: 'Authorization failed. Insufficient permissions.',
        data: null,
        errors: { details: { message: 'Insufficient permissions.' } },
      };
      return res.status(403).json(response);
    }
    next();
  };
};