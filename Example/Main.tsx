import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import QRKit from 'react-native-qr-kit';
import type { QRDecodeResponse } from 'react-native-qr-kit';



interface QRScanResult {
  data: string;
  format?: string;
  points?: string[];
  timestamp: number;
}

interface ScanError {
  message: string;
  errorType?: string;
  timestamp: number;
}

const Main = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [scanError, setScanError] = useState<ScanError | null>(null);

  /**
   * Handle image selection and QR code decoding
   */
  const handleImagePicker = async () => {
    try {
      setIsLoading(true);
      setScanError(null);
      setScanResult(null);

      launchImageLibrary(
        {
          mediaType: 'photo',
          quality: 1,
          selectionLimit: 1,
        },
        async (response) => {
          if (response.didCancel) {
            setIsLoading(false);
            return;
          }

          if (response.errorCode) {
            setScanError({
              message: `Image Picker Error: ${response.errorCode}`,
              timestamp: Date.now(),
            });
            setIsLoading(false);
            return;
          }

          const asset = response.assets?.[0];
          if (!asset?.uri) {
            setScanError({
              message: 'No image selected',
              timestamp: Date.now(),
            });
            setIsLoading(false);
            return;
          }

          await decodeQRFromImage(asset.uri);
        }
      );
    } catch (error) {
      setScanError({
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      });
      setIsLoading(false);
    }
  };

  /**
   * Decode QR code from image path
   */
  const decodeQRFromImage = async (imagePath: string) => {
    try {
      setIsLoading(true);
      setScanError(null);

      const result: QRDecodeResponse = await QRKit.decodeQR(imagePath);

      if (result.success) {
        setScanResult({
          data: result.data,
          format: result.format || 'QR_CODE',
          points: result.points,
          timestamp: Date.now(),
        });
      } else {
        setScanError({
          message: result.message,
          errorType: result.errorType,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setScanError({
        message: `Decode Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle decode from base64 string (for testing)
   */
  const handleDecodeBase64 = async () => {
    // Example base64 QR code (replace with actual QR code data)
    const sampleBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    try {
      setIsLoading(true);
      setScanError(null);

      const result: QRDecodeResponse = await QRKit.decodeBase64(sampleBase64);

      if (result.success) {
        setScanResult({
          data: result.data,
          format: result.format || 'QR_CODE',
          points: result.points,
          timestamp: Date.now(),
        });
      } else {
        setScanError({
          message: result.message,
          errorType: result.errorType,
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      setScanError({
        message: `Decode Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: Date.now(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear results
   */
  const handleClear = () => {
    setScanResult(null);
    setScanError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Scanner</Text>
        <Text style={styles.subtitle}>Scan and decode QR codes</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={handleImagePicker}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📷 Pick Image</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={handleDecodeBase64}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>🔍 Test Decode</Text>
        </TouchableOpacity>

        {(scanResult || scanError) && (
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleClear}
          >
            <Text style={styles.buttonText}>Clear Results</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Processing QR Code...</Text>
        </View>
      )}

      {/* Success Result */}
      {scanResult && !isLoading && (
        <View style={styles.resultContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>✅ QR Code Detected</Text>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Data:</Text>
              <Text style={styles.resultValue}>{scanResult.data}</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Format:</Text>
              <Text style={styles.resultValue}>{scanResult.format}</Text>
            </View>

            {scanResult.points && scanResult.points.length > 0 && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Detected Points:</Text>
                {scanResult.points.map((point, index) => (
                  <Text key={index} style={styles.pointValue}>
                    Corner {index + 1}: {point}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Timestamp:</Text>
              <Text style={styles.resultValue}>
                {new Date(scanResult.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Error Result */}
      {scanError && !isLoading && (
        <View style={styles.errorContainer}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>❌ Error Detected</Text>

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Message:</Text>
              <Text style={styles.errorValue}>{scanError.message}</Text>
            </View>

            {scanError.errorType && (
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Error Type:</Text>
                <Text style={styles.resultValue}>{scanError.errorType}</Text>
              </View>
            )}

            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Timestamp:</Text>
              <Text style={styles.resultValue}>
                {new Date(scanError.timestamp).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to use:</Text>
        <Text style={styles.infoText}>1. Tap "Pick Image" to select a QR code image</Text>
        <Text style={styles.infoText}>2. The app will decode the QR code automatically</Text>
        <Text style={styles.infoText}>3. View the decoded data and details</Text>
        <Text style={styles.infoText}>4. Tap "Clear Results" to scan another QR code</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  buttonContainer: {
    padding: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007AFF',
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonDanger: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  resultContainer: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
  },
  pointValue: {
    fontSize: 13,
    color: '#555',
    marginLeft: 8,
    marginTop: 4,
  },
  errorContainer: {
    padding: 20,
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
    borderRadius: 8,
    padding: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 16,
  },
  errorValue: {
    fontSize: 14,
    color: '#D32F2F',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default Main;
