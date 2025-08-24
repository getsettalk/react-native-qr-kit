
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import QRKit from 'react-native-qr-kit';


const QRCodeDecode = () => {
  const [imagePath, setImagePath] = useState(null);
  const [resultLog, setResultLog] = useState([]);

  const clearLogs = () => setResultLog([]);

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      async (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Image picker error');
          return;
        }
        const asset = response.assets && response.assets[0];
        if (asset && asset.uri) {
          const path = asset.uri.replace('file://', '');
          setImagePath(asset.uri); // keep uri for Image component

          try {
            const result = await QRKit.decodeQR(path);
            console.log('QR Code Result:', result);
            setResultLog((prev) => [
              { type: 'decoded', data: result },
              ...prev
            ]);
          } catch (error) {
            setResultLog((prev) => [
              { type: 'error', data: error?.message || error?.toString() },
              ...prev
            ]);
          }
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QR Code Decoder</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Select QR Image</Text>
      </TouchableOpacity>
      {imagePath && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imagePath }} style={styles.image} resizeMode="contain" />
          <Text style={styles.pathText}>{imagePath}</Text>
        </View>
      )}
      <View style={styles.logContainer}>
        <View style={styles.logHeader}>
          <Text style={styles.logTitle}>Terminal Log</Text>
          <TouchableOpacity style={styles.clearButton} onPress={clearLogs} activeOpacity={0.7}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.logScroll} contentContainerStyle={{ paddingBottom: 0 }}>
          {resultLog.length === 0 ? (
            <Text style={styles.logTextEmpty}>No logs yet.</Text>
          ) : (
            resultLog.map((log, idx) => {
              if (log.type === 'decoded') {
                let parsed = log.data;
                let isSuccess = false;
                let neonData = '';
                try {
                  if (typeof parsed === 'string') parsed = JSON.parse(parsed);
                  isSuccess = parsed && parsed.success;
                  neonData = parsed && parsed.data ? parsed.data : '';
                } catch (e) {
                  // fallback
                }
                return (
                  <Text key={idx} style={styles.logText}>
                    <Text style={styles.logPrefix}>{'> Decoded: '}</Text>
                    {isSuccess && neonData ? (
                      <Text style={styles.neonGreen}>{neonData + '\n'}</Text>
                    ) : null}
                    {JSON.stringify(log.data, null, 2)}
                  </Text>
                );
              } else {
                return (
                  <Text key={idx} style={styles.logText}>
                    <Text style={styles.logPrefix}>{'> Error: '}</Text>
                    {log.data}
                  </Text>
                );
              }
            })
          )}
 
        </ScrollView>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F5F6FA',
    marginTop: 48,
    marginBottom: 24,
    letterSpacing: 1.2,
  },
  button: {
    backgroundColor: '#246BFD',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 24,
    shadowColor: '#246BFD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 18,
    width: '90%',
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: 220,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#1A1B22',
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#23242A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  clearButton: {
    backgroundColor: '#23242A',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#333',
    marginLeft: 10,
  },
  clearButtonText: {
    color: '#FF6B81',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  pathText: {
    color: '#8F93A2',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  logContainer: {
    flex: 1,
    width: '94%',
    backgroundColor: '#181A20',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 12,
    padding: 0,
    borderWidth: 1,
    borderColor: '#23242A',
    overflow: 'hidden',
  },
   neonGreen: {
    color: '#39FF14',
    fontWeight: 'bold',
    fontFamily: 'Menlo',
    fontSize: 13,
  },
  logPrefix: {
    color: '#7CFCAC',
    fontFamily: 'Menlo',
    fontSize: 13,
  },
  logTitle: {
    color: '#7CFCAC',
    fontSize: 15,
    fontWeight: 'bold',
    backgroundColor: '#23242A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    letterSpacing: 0.5,
  },
  logScroll: {
    // maxHeight: 180,
    paddingHorizontal: 12,
    backgroundColor: '#181A20',
  },
  logText: {
    color: '#F5F6FA',
    fontFamily: 'Menlo',
    fontSize: 13,
    marginVertical: 2,
    backgroundColor: 'transparent',
  },
  logTextEmpty: {
    color: '#555',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default QRCodeDecode;
