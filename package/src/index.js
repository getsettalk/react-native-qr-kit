import { NativeModules, Platform } from 'react-native';

// this module has developed by sujeet kumar @getsettalk

const QRKit = Platform.select({
  ios: NativeModules.QRKitModule, // iOS-specific module name
  android: NativeModules.QRKit,  // Android-specific module name
});

/**
 * QRKit: A cross-platform wrapper for QR code operations.
 *
 * Methods:
 * - decodeBase64(base64Str): Decodes a QR code from a base64-encoded image string (e.g: "iVBORw0KGgo...").
 * - decodeQR(path): Decodes a QR code from a local file path.
 * - decodeMultiple(path): Decodes multiple QR codes from a local file path.
 * - generateQRCode(data, size): Generates a QR code as a base64-encoded PNG image.
 */
const QRKitWrapper = {
  /**
   * Decodes a QR code from a base64-encoded image string.
   * @param {string} base64Str - The base64-encoded image string.
   * @returns {Promise<object>} - A promise resolving to the decoded QR code data.
   */
  decodeBase64: (base64Str) => QRKit.decodeBase64(base64Str),

  /**
   * Decodes a QR code from a local file path.
   * @param {string} path - The file path of the image containing the QR code.
   * @returns {Promise<object>} - A promise resolving to the decoded QR code data.
   */
  decodeQR: (path) => QRKit.decodeQR(path),

  /**
   * Decodes multiple QR codes from a local file path.
   * @param {string} path - The file path of the image containing multiple QR codes.
   * @returns {Promise<object>} - A promise resolving to an array of decoded QR code data.
   */
  decodeMultiple: (path) => QRKit.decodeMultiple(path),

  /**
   * Generates a QR code as a base64-encoded PNG image.
   * @param {string} data - The data to encode in the QR code.
   * @param {number} size - The size of the generated QR code image.
   * @returns {Promise<object>} - A promise resolving to the generated QR code image data.
   */
  generateQRCode: (data, size) => QRKit.generateQRCode(data, size),
};

export default QRKitWrapper;