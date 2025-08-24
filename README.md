<img width="1536" height="1024" alt="ChatGPT Image Aug 24, 2025, 01_35_04 PM" src="https://github.com/user-attachments/assets/e503d854-af25-4789-a9b4-bcc2004fdd77" />

# react-native-qr-kit

[![npm version](https://img.shields.io/npm/v/react-native-qr-kit.svg)](https://www.npmjs.com/package/react-native-qr-kit)
[![Downloads](https://img.shields.io/npm/dm/react-native-qr-kit.svg)](https://www.npmjs.com/package/react-native-qr-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A fast, offline, and fully native QR code toolkit for React Native (Android only).**  
> Decode QR codes from images, decode multiple QR codes, decode from base64, and generate QR codes — all locally, with no network required.

---

## ✨ Features

- **Offline**: All QR code operations are performed locally on the device.
- **Decode from Image**: Extract QR code data from any image file.
- **Decode from Base64**: Decode QR code from a base64-encoded image string.
- **Decode Multiple**: Detect and decode multiple QR codes in a single image.
- **Generate QR Code**: Create QR codes as base64 PNG images.
- **Native Performance**: Built with native Android code for speed and reliability.
- **Easy Integration**: Simple API for React Native apps.

> **Note:**  
> Currently, only Android is supported. iOS support is planned for a future release.

---

## 📦 Installation

```sh
npm install react-native-qr-kit
```
or

```sh
yarn add react-native-qr-kit
```

### Android Manual Linking (if needed) 
If autolinking does not work, add the package manually in your `MainApplication.java`/`kt`:
```js
import QRKit from 'react-native-qr-kit';

// ⚠️ IMPORTANT: If you use react-native-image-picker or similar, the image URI may start with 'file://'.
// For Android native modules, you must strip the 'file://' prefix before passing the path to QRKit methods.
// This is required because native Android file APIs expect a plain file path, not a URI.

// Example:
const asset = response.assets[0];
const path = asset.uri.replace('file://', ''); // <-- Remove 'file://' for Android native
const result = await QRKit.decodeQR(path);

// You can still use the original uri for <Image source={{ uri: asset.uri }} />

// Decode a QR code from a base64 image string
const result2 = await QRKit.decodeBase64(base64String);

// Decode multiple QR codes from an image
const result3 = await QRKit.decodeMultiple(path);

// Generate a QR code as a base64 PNG
const result4 = await QRKit.generateQRCode('https://example.com', 300);
```

---

> **⚠️  Note: If you use an image picker or any method that returns a URI starting with 'file://', you must remove the 'file://' prefix before passing the path to QRKit's native methods.**  🚨

```js
import QRKit from 'react-native-qr-kit';

// Decode a QR code from an image file path
const result = await QRKit.decodeQR('/storage/emulated/0/Download/qr.png');

// Decode a QR code from a base64 image string
const result = await QRKit.decodeBase64(base64String);

// Decode multiple QR codes from an image
const result = await QRKit.decodeMultiple('/storage/emulated/0/Download/multi-qr.png');

// Generate a QR code as a base64 PNG
const result = await QRKit.generateQRCode('https://example.com', 300);
```

---

## 📋 API Reference

### `decodeQR(path: string): Promise<DecodeResult>`
Decode a QR code from a local image file path.

**Returns:**
```
{
  success: true,
  data: string,         // QR code content
  error: null,
  format: string,       // QR code format (e.g. 'QR_CODE')
  points: string[]      // Array of detected points (e.g. ["120.0,45.0", ...])
}
// or on failure
{
  success: false,
  errorType: string,
  message: string,
  details?: string,
  stack?: string
}
```

### `decodeBase64(base64Str: string): Promise<DecodeResult>`
Decode a QR code from a base64-encoded image string.

**Returns:**
```
{
  success: true,
  data: string
}
// or on failure
{
  success: false,
  message: string
}
```

### `decodeMultiple(path: string): Promise<MultiDecodeResult>`
Decode multiple QR codes from a local image file path.

**Returns:**
```
{
  success: true,
  results: [
    { data: string, format: string },
    ...
  ]
}
// or on failure
{
  success: false,
  message: string
}
```

### `generateQRCode(data: string, size: number): Promise<GenerateResult>`
Generate a QR code as a base64 PNG image.

**Returns:**
```
{
  success: true,
  base64: string // PNG image as base64
}
// or on failure
{
  success: false,
  message: string
}
```

---

## 📱 Screenshots



<p align="center">
<img width="200"  alt="image" src="https://github.com/user-attachments/assets/1bae5906-d1cc-4221-8c72-6ac1f5e48960" />
<img width="200"  alt="image1" src="https://github.com/user-attachments/assets/9f45b537-c1de-464e-9c82-b563824d8df8" />
</p>
---

## 🎬 Demo Video



<p align="center">
  <video src="https://github.com/user-attachments/assets/af9bae19-5950-4254-8a49-709a932ae705" width="250" controls></video>
</p>

---

## ℹ️ Notes
- All QR code decoding and generation is performed **offline** and locally on the device.
- Only Android is supported at this time. iOS support is coming soon.
- Works with any local image file path accessible to your app.

---

## 🏷️ Tags
`react-native` `qr` `qr-code` `offline` `android` `native-module` `scanner` `generator`

---

## 📄 License

MIT © [getsettalk](https://github.com/getsettalk)
