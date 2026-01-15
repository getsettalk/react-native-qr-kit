import { NativeModules, Platform } from 'react-native';
import type { IQRKit, QRDecodeResponse, QRDecodeMultipleResponse, QRGenerateResponse } from './types';

// this module has developed by sujeet kumar @getsettalk

const QRKit = Platform.select<IQRKit>({
  ios: NativeModules.QRKitModule, // iOS-specific module name
  android: NativeModules.QRKit,  // Android-specific module name
}) as IQRKit;

/**
 * QRKit: A cross-platform wrapper for QR code operations.
 *
 * Methods:
 * - decodeBase64(base64Str): Decodes a QR code from a base64-encoded image string (e.g: "iVBORw0KGgo...").
 * - decodeQR(path): Decodes a QR code from a local file path.
 * - decodeMultiple(path): Decodes multiple QR codes from a local file path.
 * - generateQRCode(data, size): Generates a QR code as a base64-encoded PNG image.
 */
const QRKitWrapper: IQRKit = {
  /**
   * Decodes a QR code from a base64-encoded image string.
   * @param {string} base64Str - The base64-encoded image string.
   * @returns {Promise<QRDecodeResponse>} - A promise resolving to the decoded QR code data.
   */
  decodeBase64: (base64Str: string): Promise<QRDecodeResponse> => 
    QRKit.decodeBase64(base64Str),

  /**
   * Decodes a QR code from a local file path.
   * @param {string} path - The file path of the image containing the QR code.
   * @returns {Promise<QRDecodeResponse>} - A promise resolving to the decoded QR code data.
   */
  decodeQR: (path: string): Promise<QRDecodeResponse> => 
    QRKit.decodeQR(path),

  /**
   * Decodes multiple QR codes from a local file path.
   * @param {string} path - The file path of the image containing multiple QR codes.
   * @returns {Promise<QRDecodeMultipleResponse>} - A promise resolving to an array of decoded QR code data.
   */
  decodeMultiple: (path: string): Promise<QRDecodeMultipleResponse> => 
    QRKit.decodeMultiple(path),

  /**
   * Generates a QR code as a base64-encoded PNG image.
   * @param {string} data - The data to encode in the QR code.
   * @param {number} size - The size of the generated QR code image.
   * @returns {Promise<QRGenerateResponse>} - A promise resolving to the generated QR code image data.
   */
  generateQRCode: (data: string, size: number): Promise<QRGenerateResponse> => 
    QRKit.generateQRCode(data, size),
};

export default QRKitWrapper;
export * from './types';
