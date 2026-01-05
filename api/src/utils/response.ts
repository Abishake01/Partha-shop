// Standardized API response formatter

import { Response } from 'express';
import { HTTP_STATUS, API_MESSAGES } from './constants';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Send successful response
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = API_MESSAGES.SUCCESS,
  statusCode: number = HTTP_STATUS.OK,
  path?: string
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
    path,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: any,
  message: string = API_MESSAGES.SUCCESS,
  statusCode: number = HTTP_STATUS.OK,
  path?: string
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
    path,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: string = API_MESSAGES.INTERNAL_ERROR,
  error?: string,
  path?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    statusCode,
    message,
    error,
    timestamp: new Date().toISOString(),
    path,
  };
  return res.status(statusCode).json(response);
};

/**
 * Send created response
 */
export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = API_MESSAGES.CREATED,
  path?: string
): Response => {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED, path);
};

/**
 * Send no content response
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(204).send();
};

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: any[],
  path?: string
): Response => {
  const response: ApiResponse = {
    success: false,
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    message: API_MESSAGES.VALIDATION_ERROR,
    error: errors.map((e) => e.msg || e.message).join(', '),
    timestamp: new Date().toISOString(),
    path,
  };
  return res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json(response);
};
