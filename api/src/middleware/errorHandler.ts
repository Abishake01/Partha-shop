import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { HTTP_STATUS, API_MESSAGES } from '../utils/constants';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 * Catches and logs all errors from the application
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const timestamp = new Date().toISOString();
  const requestId = req.id || 'unknown';

  // Log error details
  logError({
    timestamp,
    requestId,
    method: req.method,
    path: req.path,
    statusCode: err instanceof AppError ? err.statusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: err.message,
    code: err instanceof AppError ? err.code : undefined,
    stack: isDevelopment ? err.stack : undefined,
  });

  // Handle known operational errors
  if (err instanceof AppError) {
    return sendError(
      res,
      err.statusCode,
      err.message,
      isDevelopment ? err.code : undefined,
      req.path
    );
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return sendError(
      res,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      API_MESSAGES.VALIDATION_ERROR,
      err.message,
      req.path
    );
  }

  if (err.name === 'CastError') {
    return sendError(
      res,
      HTTP_STATUS.BAD_REQUEST,
      'Invalid request data',
      'CAST_ERROR',
      req.path
    );
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      API_MESSAGES.INVALID_TOKEN,
      'JWT_ERROR',
      req.path
    );
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      API_MESSAGES.TOKEN_EXPIRED,
      'TOKEN_EXPIRED',
      req.path
    );
  }

  // Handle unhandled promise rejections and unknown errors
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    API_MESSAGES.INTERNAL_ERROR,
    isDevelopment ? err.message : undefined,
    req.path
  );
};

/**
 * Utility function to log errors
 */
function logError(errorLog: {
  timestamp: string;
  requestId: string;
  method: string;
  path: string;
  statusCode: number;
  message: string;
  code?: string;
  stack?: string;
}): void {
  const logEntry = {
    ...errorLog,
    level: errorLog.statusCode >= 500 ? 'ERROR' : 'WARN',
  };

  console.error(`[${logEntry.timestamp}] ${logEntry.level}:`, JSON.stringify(logEntry, null, 2));

  // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
  // Example:
  // if (logEntry.level === 'ERROR') {
  //   Sentry.captureException(new Error(errorLog.message), { contexts: { request: errorLog } });
  // }
}

/**
 * Handle 404 errors
 */
export const notFoundHandler = (req: Request, res: Response) => {
  sendError(
    res,
    HTTP_STATUS.NOT_FOUND,
    `Route ${req.method} ${req.path} not found`,
    'ROUTE_NOT_FOUND',
    req.path
  );
};

/**
 * Handle async errors wrapper
 * Wraps async route handlers to catch errors
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

