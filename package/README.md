<img width="1248" height="832" alt="Banner Image" src="https://github.com/user-attachments/assets/b640186f-1de1-4696-a8c6-51c1ed062595" />

# react-native-qr-kit

[![npm version](https://img.shields.io/npm/v/react-native-qr-kit.svg)](https://www.npmjs.com/package/react-native-qr-kit)
[![Downloads](https://img.shields.io/npm/dm/react-native-qr-kit.svg)](https://www.npmjs.com/package/react-native-qr-kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **A fast, offline, and fully native QR code toolkit for React Native (Android and iOS).**  
> Decode QR codes from images, decode multiple QR codes, decode from base64, and generate QR codes — all locally, with no network required.

---

## ✨ Features

- **Offline**: All QR code operations are performed locally on the device.
- **Decode from Image**: Extract QR code data from any image file.
- **Decode from Base64**: Decode QR code from a base64-encoded image string.
- **Decode Multiple**: Detect and decode multiple QR codes in a single image.
- **Generate QR Code**: Create QR codes as base64 PNG images.
- **Native Performance**: Built with native Android and iOS code for speed and reliability.
- **Easy Integration**: Simple API for React Native apps.

> **Note:**  
> While the library is fully focused on QR codes, decoding other barcode formats may not work reliably on iOS. See [#screenshot](#Screenshots) below for an example.

---

## 📦 Installation

```sh
npm install react-native-qr-kit
```
or

```sh
yarn add react-native-qr-kit
```

### iOS Setup
Run the following commands to install iOS dependencies:

```sh
cd ios
pod install
```

### Android Manual Linking (if needed) 
If autolinking does not work, add the package manually in your `MainApplication.java`/`kt`:

```java
import com.qrkit.QRKitPackage; // <-- add this import

@Override
protected List<ReactPackage> getPackages() {
  return Arrays.<ReactPackage>asList(
    // ...other packages
    new QRKitPackage() // <-- add this line
  );
}
```

---

## 📋 Usage

### `decodeBase64`

Decodes a QR code from a base64-encoded image string.(e.g., "iVBORw0KGgo...")

#### Example:
```js
import QRKit from 'react-native-qr-kit';

const decodeBase64 = async (base64String) => {
  try {
    const result = await QRKit.decodeBase64(base64String);
    if (result.success) {
      console.log('QR Code Data:', result.data);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
  }
};
```

#### Expected Response:
```js
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

---

### `decodeQR`

Decodes a QR code from a local file path.

#### Example:
```js
import QRKit from 'react-native-qr-kit';

const decodeQR = async (ImagePath) => {
  try {
    const result = await QRKit.decodeQR(ImagePath);
    if (result.success) {
      console.log('QR Code Data:', result.data);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
  }
};
```

#### For image choose:
- you can use any library for select image, but i suggest `react-native-image-picker`


#### Expected Response:
```js
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

---

### `decodeMultiple`

Decodes multiple QR codes from a local file path.

#### Example:
```js
import QRKit from 'react-native-qr-kit';

const decodeMultiple = async (ImagePath) => {
  try {
    const result = await QRKit.decodeMultiple(ImagePath);
    if (result.success) {
      console.log('QR Codes:', result.results);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
  }
};
```

#### For image choose:
- you can use any library for select image, but i suggest `react-native-image-picker`

#### Expected Response:
```js
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

---

### `generateQRCode`

Generates a QR code as a base64 PNG image.

#### Example:
```js
import QRKit from 'react-native-qr-kit';

const generateQRCode = async (data, size) => {
  try {
    const result = await QRKit.generateQRCode(data, size);
    if (result.success) {
      console.log('Generated QR Code (Base64):', result.base64);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Unexpected Error:', error);
  }
};
```

#### Expected Response:
```js
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

## 📋 API Reference

### `decodeQR(path: string): Promise<DecodeResult>`
Decode a QR code from a local image file path.

**Returns:**
```js
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
```js
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
```js
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
```js
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

## Screenshots



<p align="center">
<img width="200"  alt="image" src="https://github.com/user-attachments/assets/7f04bdf2-ef6b-4a9d-9397-3fdafedb835e" />
<img width="200"  alt="image1" src="https://github.com/user-attachments/assets/6d980ef4-5c59-418f-99f4-b6b6b415c443" />
<video src="https://github.com/user-attachments/assets/f9a0c97a-0100-453c-91e4-1ddf9a33daf6" width="200" controls></video>
<video src="https://github.com/user-attachments/assets/658e42f4-8246-4ffa-9255-7f3436a5c177" width="200" controls></video>
</p>






---

## ℹ️ Notes
- All QR code decoding and generation is performed **offline** and locally on the device.
- The library is fully focused on QR codes. Decoding other barcode formats may not work reliably on iOS.
- Works with any local image file path accessible to your app.

---



## 📄 License

MIT © [getsettalk](https://github.com/getsettalk)
