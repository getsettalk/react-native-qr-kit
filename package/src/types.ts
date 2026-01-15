/**
 * TypeScript Type Definitions for react-native-qr-kit
 * Minimal types for existing methods
 */

export type QRFormat = 'QR_CODE' | 'CODE_128' | 'EAN_13' | 'UPC_A' | 'PDF_417' | string;

export type ErrorType = 'ValidationError' | 'Base64Error' | 'ImageError' | 'FileError' | 'NotFoundException' | string;

/**
 * Response for successful decode
 */
export interface QRDecodeSuccess {
  success: true;
  data: string;
  error?: null;
  format?: QRFormat;
  points?: string[];
  confidence?: number;
  [key: string]: any;
}

/**
 * Response for decode error
 */
export interface QRDecodeError {
  success: false;
  message: string;
  errorType?: ErrorType;
  details?: string;
  stack?: string;
  error?: string;
  [key: string]: any;
}

export type QRDecodeResponse = QRDecodeSuccess | QRDecodeError;

/**
 * Response for decoding multiple QR codes
 */
export interface QRDecodeMultipleSuccess {
  success: true;
  results: Array<{
    data: string;
    format?: QRFormat;
    points?: string[];
    confidence?: number;
  }>;
}

/**
 * Response for decode multiple error
 */
export interface QRDecodeMultipleError {
  success: false;
  message: string;
  errorType?: ErrorType;
  details?: string;
  [key: string]: any;
}

export type QRDecodeMultipleResponse = QRDecodeMultipleSuccess | QRDecodeMultipleError;

/**
 * Response for QR code generation
 */
export interface QRGenerateSuccess {
  success: true;
  base64: string;
  format?: string;
}

/**
 * Response for generation error
 */
export interface QRGenerateError {
  success: false;
  message: string;
  errorType?: ErrorType;
  [key: string]: any;
}

export type QRGenerateResponse = QRGenerateSuccess | QRGenerateError;

/**
 * Main QRKit interface
 */
export interface IQRKit {
  decodeBase64(base64Str: string): Promise<QRDecodeResponse>;
  decodeQR(path: string): Promise<QRDecodeResponse>;
  decodeMultiple(path: string): Promise<QRDecodeMultipleResponse>;
  generateQRCode(data: string, size: number): Promise<QRGenerateResponse>;
}
