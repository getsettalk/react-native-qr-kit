# TypeScript Guide for react-native-qr-kit

Complete TypeScript type definitions and usage guide for `react-native-qr-kit`.

## 📖 Table of Contents

- [Installation](#installation)
- [Type Definitions](#type-definitions)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

---

## Installation

```bash
npm install react-native-qr-kit
# TypeScript types are automatically included!
```

---

## Type Definitions

### Core Types

#### `QRFormat`
```typescript
type QRFormat = 'QR_CODE' | 'CODE_128' | 'EAN_13' | 'UPC_A' | 'PDF_417' | string;
```
Represents the barcode format. Includes common formats with fallback to `string` for unknown formats.

#### `ErrorType`
```typescript
type ErrorType = 
  | 'ValidationError'
  | 'Base64Error'
  | 'ImageError'
  | 'FileError'
  | 'NotFoundException'
  | string;
```
Error types returned from operations. Fallback to `string` for unexpected errors.

---

### Response Interfaces

#### `QRDecodeSuccess`
```typescript
interface QRDecodeSuccess {
  success: true;
  data: string;                    // Decoded QR content
  error?: null;
  format?: QRFormat;               // Barcode format (QR_CODE, etc)
  points?: string[];               // Corner coordinates ["x1,y1", "x2,y2", ...]
  confidence?: number;             // Detection confidence (0-1)
  [key: string]: any;             // Extra properties from native layer
}
```

#### `QRDecodeError`
```typescript
interface QRDecodeError {
  success: false;
  message: string;                 // Error description
  errorType?: ErrorType;           // Type of error
  details?: string;                // Additional error details
  stack?: string;                  // Stack trace (iOS only)
  error?: string;
  [key: string]: any;             // Extra properties from native layer
}
```

#### `QRDecodeResponse`
```typescript
type QRDecodeResponse = QRDecodeSuccess | QRDecodeError;
```
Union type for single QR decode responses.

---

#### `QRDecodeMultipleSuccess`
```typescript
interface QRDecodeMultipleSuccess {
  success: true;
  results: Array<{
    data: string;                  // Decoded content
    format?: QRFormat;             // Format
    points?: string[];             // Coordinates
    confidence?: number;           // Confidence
  }>;
}
```

#### `QRDecodeMultipleError`
```typescript
interface QRDecodeMultipleError {
  success: false;
  message: string;
  errorType?: ErrorType;
  details?: string;
  [key: string]: any;
}
```

#### `QRDecodeMultipleResponse`
```typescript
type QRDecodeMultipleResponse = 
  | QRDecodeMultipleSuccess 
  | QRDecodeMultipleError;
```
Union type for multiple QR decode responses.

---

#### `QRGenerateSuccess`
```typescript
interface QRGenerateSuccess {
  success: true;
  base64: string;                  // Base64 PNG image
  format?: string;
}
```

#### `QRGenerateError`
```typescript
interface QRGenerateError {
  success: false;
  message: string;
  errorType?: ErrorType;
}
```

#### `QRGenerateResponse`
```typescript
type QRGenerateResponse = QRGenerateSuccess | QRGenerateError;
```

---

### Main Interface

#### `IQRKit`
```typescript
interface IQRKit {
  decodeBase64(base64Str: string): Promise<QRDecodeResponse>;
  decodeQR(path: string): Promise<QRDecodeResponse>;
  decodeMultiple(path: string): Promise<QRDecodeMultipleResponse>;
  generateQRCode(data: string, size: number): Promise<QRGenerateResponse>;
}
```

---

## Usage Examples

### Basic Decoding (Single QR Code)

```typescript
import QRKit from 'react-native-qr-kit';
import type { QRDecodeResponse } from 'react-native-qr-kit';

const scanQRCode = async (imagePath: string) => {
  const result: QRDecodeResponse = await QRKit.decodeQR(imagePath);

  if (result.success) {
    // Type-safe access to success properties
    console.log('Data:', result.data);
    console.log('Format:', result.format);
    console.log('Points:', result.points);
  } else {
    // Type-safe access to error properties
    console.log('Error:', result.message);
    console.log('Error Type:', result.errorType);
  }
};
```

### Decoding from Base64

```typescript
import QRKit from 'react-native-qr-kit';
import type { QRDecodeResponse } from 'react-native-qr-kit';

const decodeBase64 = async (base64String: string) => {
  try {
    const result: QRDecodeResponse = await QRKit.decodeBase64(base64String);

    if (result.success) {
      console.log(`QR Code: ${result.data}`);
    } else {
      console.log(`Failed: ${result.message}`);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};
```

### Decoding Multiple QR Codes

```typescript
import QRKit from 'react-native-qr-kit';
import type { QRDecodeMultipleResponse } from 'react-native-qr-kit';

const scanMultipleQRCodes = async (imagePath: string) => {
  const result: QRDecodeMultipleResponse = await QRKit.decodeMultiple(imagePath);

  if (result.success) {
    // Access the results array
    result.results.forEach((qr, index) => {
      console.log(`QR ${index + 1}: ${qr.data}`);
      console.log(`  Format: ${qr.format}`);
      if (qr.points) {
        console.log(`  Points:`, qr.points);
      }
    });
  } else {
    console.log(`Error: ${result.message}`);
  }
};
```

### Generating QR Codes

```typescript
import QRKit from 'react-native-qr-kit';
import type { QRGenerateResponse } from 'react-native-qr-kit';

const generateQR = async (text: string) => {
  const result: QRGenerateResponse = await QRKit.generateQRCode(text, 256);

  if (result.success) {
    // Use the base64 string to display as image
    console.log('QR Code Base64:', result.base64);
    // Display: <Image source={{uri: `data:image/png;base64,${result.base64}`}} />
  } else {
    console.log(`Generation failed: ${result.message}`);
  }
};
```

---

### Type-Safe Result Handling Pattern

```typescript
import QRKit from 'react-native-qr-kit';
import type { QRDecodeResponse } from 'react-native-qr-kit';

interface QRResult {
  success: boolean;
  data?: string;
  error?: string;
}

const handleQRDecode = async (imagePath: string): Promise<QRResult> => {
  const result: QRDecodeResponse = await QRKit.decodeQR(imagePath);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    return {
      success: false,
      error: result.message,
    };
  }
};

// Usage
const qrResult = await handleQRDecode('/path/to/image.jpg');
if (qrResult.success) {
  console.log('Decoded:', qrResult.data);
} else {
  console.log('Failed:', qrResult.error);
}
```

---

### React Component with TypeScript

```typescript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QRKit from 'react-native-qr-kit';
import type { QRDecodeResponse, QRDecodeSuccess } from 'react-native-qr-kit';

interface ScanState {
  isLoading: boolean;
  result: QRDecodeSuccess | null;
  error: string | null;
}

const QRScanner: React.FC = () => {
  const [state, setState] = useState<ScanState>({
    isLoading: false,
    result: null,
    error: null,
  });

  const handleScan = async (imagePath: string) => {
    setState({ isLoading: true, result: null, error: null });

    try {
      const response: QRDecodeResponse = await QRKit.decodeQR(imagePath);

      if (response.success) {
        setState((prev) => ({
          ...prev,
          result: response,
          error: null,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message,
          result: null,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        result: null,
      }));
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => handleScan('/path/to/image')}>
        <Text>Scan QR</Text>
      </TouchableOpacity>

      {state.result && <Text>Data: {state.result.data}</Text>}
      {state.error && <Text>Error: {state.error}</Text>}
    </View>
  );
};

export default QRScanner;
```

---

### Custom Type Guards

```typescript
import type { QRDecodeResponse, QRDecodeSuccess, QRDecodeError } from 'react-native-qr-kit';

// Type guard for success
const isQRSuccess = (result: QRDecodeResponse): result is QRDecodeSuccess => {
  return result.success === true;
};

// Type guard for error
const isQRError = (result: QRDecodeResponse): result is QRDecodeError => {
  return result.success === false;
};

// Usage
const result = await QRKit.decodeQR('/path/to/image');

if (isQRSuccess(result)) {
  // TypeScript knows result is QRDecodeSuccess here
  console.log(result.data);
  console.log(result.format);
} else if (isQRError(result)) {
  // TypeScript knows result is QRDecodeError here
  console.log(result.message);
  console.log(result.errorType);
}
```

---

## API Reference

### Methods

#### `decodeBase64(base64Str: string): Promise<QRDecodeResponse>`

Decode QR code from base64-encoded image string.

**Parameters:**
- `base64Str` (string): Base64-encoded image data (e.g., "iVBORw0KGgo...")

**Returns:** Promise resolving to `QRDecodeResponse`

**Example:**
```typescript
const result = await QRKit.decodeBase64('iVBORw0KGgo...');
```

---

#### `decodeQR(path: string): Promise<QRDecodeResponse>`

Decode single QR code from image file path.

**Parameters:**
- `path` (string): File path to image (can include "file://" prefix)

**Returns:** Promise resolving to `QRDecodeResponse`

**Example:**
```typescript
const result = await QRKit.decodeQR('/path/to/image.jpg');
```

---

#### `decodeMultiple(path: string): Promise<QRDecodeMultipleResponse>`

Decode multiple QR codes from image file path.

**Parameters:**
- `path` (string): File path to image containing multiple QR codes

**Returns:** Promise resolving to `QRDecodeMultipleResponse`

**Example:**
```typescript
const result = await QRKit.decodeMultiple('/path/to/image.jpg');
if (result.success) {
  result.results.forEach(qr => console.log(qr.data));
}
```

---

#### `generateQRCode(data: string, size: number): Promise<QRGenerateResponse>`

Generate QR code as base64-encoded PNG image.

**Parameters:**
- `data` (string): Text or data to encode
- `size` (number): QR code image size in pixels

**Returns:** Promise resolving to `QRGenerateResponse`

**Example:**
```typescript
const result = await QRKit.generateQRCode('https://example.com', 256);
if (result.success) {
  console.log('Base64:', result.base64);
}
```

---

## Best Practices

### ✅ Always Use Type Guards

```typescript
const result = await QRKit.decodeQR(path);

// Good - type-safe
if (result.success) {
  console.log(result.data); // TypeScript knows this exists
}

// Avoid - no type checking
if (result.success) {
  console.log(result.message); // TypeScript error - doesn't exist on success type
}
```

### ✅ Use Proper Response Types

```typescript
// Good - explicit typing
const result: QRDecodeResponse = await QRKit.decodeQR(path);

// Avoid - implicit any
const result = await QRKit.decodeQR(path); // Could be any
```

### ✅ Handle Optional Properties

```typescript
const result: QRDecodeResponse = await QRKit.decodeQR(path);

if (result.success) {
  // Optional properties - check before using
  const format = result.format ?? 'UNKNOWN';
  const points = result.points ?? [];
  
  console.log(`Format: ${format}`);
  console.log(`Points: ${points.length}`);
}
```

### ✅ Define Custom Types for Your App

```typescript
// Define your app's QR data structure
interface AppQRData {
  type: 'URL' | 'TEXT' | 'EMAIL';
  value: string;
  scannedAt: number;
}

// Use with library types
import type { QRDecodeResponse } from 'react-native-qr-kit';

const parseQR = (result: QRDecodeResponse): AppQRData | null => {
  if (!result.success) return null;

  // Your parsing logic
  return {
    type: 'URL',
    value: result.data,
    scannedAt: Date.now(),
  };
};
```

### ✅ Proper Error Handling

```typescript
import type { QRDecodeResponse } from 'react-native-qr-kit';

async function scanQR(path: string): Promise<void> {
  try {
    const result: QRDecodeResponse = await QRKit.decodeQR(path);

    if (result.success) {
      console.log(`Success: ${result.data}`);
    } else {
      // Handle different error types
      if (result.errorType === 'NotFoundException') {
        console.log('No QR code found in image');
      } else if (result.errorType === 'FileError') {
        console.log('Could not load image file');
      } else {
        console.log(`Error: ${result.message}`);
      }
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Unexpected error:', error);
  }
}
```

---

## Troubleshooting

### Type Not Found Error
```
Cannot find module 'react-native-qr-kit' or its corresponding type declarations.
```

**Solution:** Install TypeScript definitions:
```bash
npm install react-native-qr-kit
npm install --save-dev typescript
```

### Missing Properties
```
Property 'data' does not exist on type 'QRDecodeResponse'
```

**Solution:** Check the success state before accessing properties:
```typescript
if (result.success) {
  console.log(result.data); // Now type-safe
}
```

### Extra Properties Not Typed
```typescript
// Native layer might return extra properties
const result = await QRKit.decodeQR(path);
if (result.success) {
  console.log(result.anyExtraProperty); // Works - [key: string]: any
}
```

---

## Related Links

- [Main Documentation](./README.md)
- [GitHub Repository](https://github.com/getsettalk/react-native-qr-kit)
- [NPM Package](https://www.npmjs.com/package/react-native-qr-kit)

---

## Questions?

For issues or questions about types, please visit:
- [GitHub Issues](https://github.com/getsettalk/react-native-qr-kit/issues)
- [GitHub Discussions](https://github.com/getsettalk/react-native-qr-kit/discussions)
