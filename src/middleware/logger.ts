import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Log file paths
const logFile = path.join(logsDir, 'api_access.log');

// Log to file
const logToFile = (message: string) => {
  fs.appendFileSync(logFile, message + '\n');
};

/**
 * Get email from various sources (token, body)
 */
const getEmailFromRequest = (req: Request | AuthRequest): string => {
  // First try to get from authenticated user 
  if ('user' in req && req.user && req.user.email) {
    return req.user.email;
  }
  
  // For login/register endpoints, try to get from request body
  if (req.body && req.body.email) {
    return req.body.email;
  }
  
  // If no email found
  return 'anonymous';
};

/**
 * Get client IP address with fallbacks
 */
const getIpAddress = (req: Request): string => {
  // Check X-Forwarded-For header (common when behind proxy)
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // If it's a comma-separated list, take the first one
    return Array.isArray(forwardedFor) 
      ? forwardedFor[0] 
      : forwardedFor.split(',')[0].trim();
  }
  
  // Check other common headers
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }
  
  // Fallback to req.ip or socket remote address
  return req.ip || 
    (req.socket ? req.socket.remoteAddress || 'unknown' : 'unknown');
};

/**
 * Request logger middleware
 * Logs all API requests with timestamp, method, URL, and user email if available
 */
export const requestLogger = (req: Request | AuthRequest, res: Response, next: NextFunction) => {
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Extract relevant request info
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = getIpAddress(req);
  
  // Get user email if available
  const userEmail = getEmailFromRequest(req);
  
  // Log request body for debugging on auth routes (but sanitize passwords)
  let bodyLog = '';
  if ((url.includes('/login') || url.includes('/register')) && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '********';
    }
    bodyLog = ` - Body: ${JSON.stringify(sanitizedBody)}`;
  }
  
  // Format log message
  const logMessage = `[${timestamp}] ${method} ${url} - User: ${userEmail} - IP: ${ip}${bodyLog}`;
  
  // Log to console
  console.log(logMessage);
  
  // Log to file
  logToFile(logMessage);
  
  // Continue with request
  next();
};

// Capture response logs
export const responseLogger = (req: Request | AuthRequest, res: Response, next: NextFunction) => {
  // Store original end method
  const originalEnd = res.end;
  
  // Get start time
  const startTime = Date.now();
  
  // Override end method
  res.end = function(chunk?: any, encoding?: any, cb?: any): any {
    // Calculate request duration
    const responseTime = Date.now() - startTime;
    
    // Get current timestamp
    const timestamp = new Date().toISOString();
    
    // Get user email if available
    const userEmail = getEmailFromRequest(req);
    
    // Format log message
    const logMessage = `[${timestamp}] Response: ${res.statusCode} - ${responseTime}ms - User: ${userEmail} - ${req.method} ${req.originalUrl || req.url}`;
    
    // Log to console
    console.log(logMessage);
    
    // Log to file
    logToFile(logMessage);
    
    // Call original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };
  
  next();
};
