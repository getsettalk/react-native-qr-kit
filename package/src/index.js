import { NativeModules, Platform } from 'react-native';

// this module has developed by sujeet kumar @getsettalk

const QRKit = Platform.select({
  ios: NativeModules.QRKitModule, // iOS-specific module name
  android: NativeModules.QRKit,  // Android-specific module name
});

const QRKitWrapper = {
  decodeBase64: (base64Str) => QRKit.decodeBase64(base64Str),
  decodeQR: (path) => QRKit.decodeQR(path),
  decodeMultiple: (path) => QRKit.decodeMultiple(path),
  generateQRCode: (data, size) => QRKit.generateQRCode(data, size),
};

export default QRKitWrapper;