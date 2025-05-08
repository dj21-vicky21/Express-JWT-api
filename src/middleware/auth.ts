import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkey';

// Extend user interface to include specific fields
export interface TokenPayload {
  userId: string;
  email: string;
  type: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // Check if authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Authentication required. Please provide a Bearer token.' 
    });
  }
  
  // Extract token
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    
    // Verify token type
    if (decoded.type !== 'bearer') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token type'
      });
    }
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      return res.status(401).json({
        status: 'error',
        message: 'Token has expired'
      });
    }
    
    // Set user in request object
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      status: 'error', 
      message: 'Invalid or expired token'
    });
  }
};
