import { NativeModules } from 'react-native';
const { QRKit } = NativeModules;

const QRKitWrapper = {
  decodeBase64: (base64Str) => QRKit.decodeBase64(base64Str),
  decodeQR: (path) => QRKit.decodeQR(path),
  decodeMultiple: (path) => QRKit.decodeMultiple(path),
  generateQRCode: (data, size) => QRKit.generateQRCode(data, size),
};

export default QRKitWrapper;
