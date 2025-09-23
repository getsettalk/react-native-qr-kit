

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image, ScrollView, Alert } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { launchImageLibrary } from 'react-native-image-picker';
import QRKit from 'react-native-qr-kit';


const MethodModal = ({ visible, onClose, onSubmit, title, inputLabel, inputType = 'text', placeholder }) => {
  const [input, setInput] = useState('');
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalBox}>
          <Text style={modalStyles.title}>{title}</Text>
          {inputLabel && <Text style={modalStyles.label}>{inputLabel}</Text>}
          {inputType === 'multiline' ? (
            <ScrollView style={modalStyles.inputScroll} contentContainerStyle={{ flexGrow: 1 }}>
              <TextInput
                style={[modalStyles.input, modalStyles.inputMultiline]}
                value={input}
                onChangeText={setInput}
                placeholder={placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                multiline
                textAlignVertical="top"
              />
            </ScrollView>
          ) : (
            <TextInput
              style={modalStyles.input}
              value={input}
              onChangeText={setInput}
              placeholder={placeholder}
              keyboardType={inputType === 'number' ? 'numeric' : 'default'}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          <View style={modalStyles.row}>
            <TouchableOpacity style={modalStyles.button} onPress={onClose}><Text style={modalStyles.buttonText}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={modalStyles.button} onPress={() => { onSubmit(input); setInput(''); }}><Text style={modalStyles.buttonText}>Submit</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const [modal, setModal] = useState(null); // 'base64' | 'generate' | null
  const [result, setResult] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');

  

  const handleCopyBase64 = () => {
    if (result && result.base64) {
      Clipboard.setString(result.base64);
      setCopyMsg('Copied!');
      setTimeout(() => setCopyMsg(''), 1200);
    }
  };

  const handleDecodeQR = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Image picker error');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset && asset.uri) {
        setImageUri(asset.uri);
        setLoading(true);
        try {
          const path = asset.uri;
          console.log(path)
          const res = await QRKit.decodeQR(path);
          setResult(res);
        } catch (e) {
          setResult({ success: false, message: e.message || String(e) });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDecodeMultiple = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Image picker error');
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset && asset.uri) {
        setImageUri(asset.uri);
        setLoading(true);
        try {
          const path = asset.uri;
          const res = await QRKit.decodeMultiple(path);
          setResult(res);
        } catch (e) {
          setResult({ success: false, message: e.message || String(e) });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleDecodeBase64 = async (base64) => {
    setModal(null);
    setLoading(true);
    setImageUri(null);
    try {
      const res = await QRKit.decodeBase64(base64);
      setResult(res);
    } catch (e) {
      setResult({ success: false, message: e.message || String(e) });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (text) => {
    setModal(null);
    setLoading(true);
    setImageUri(null);
    try {
      const res = await QRKit.generateQRCode(text, 300);
      setResult(res);
      if (res.success && res.base64) {
        setImageUri(`data:image/png;base64,${res.base64}`);
      }
    } catch (e) {
      setResult({ success: false, message: e.message || String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QRKit Test App</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleDecodeQR}><Text style={styles.buttonText}>Decode QR</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDecodeMultiple}><Text style={styles.buttonText}>Decode Multiple</Text></TouchableOpacity>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => setModal('base64')}><Text style={styles.buttonText}>Decode Base64</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setModal('generate')}><Text style={styles.buttonText}>Generate QR</Text></TouchableOpacity>
      </View>
      <MethodModal
        visible={modal === 'base64'}
        onClose={() => setModal(null)}
        onSubmit={handleDecodeBase64}
        title="Decode QR from Base64"
        inputLabel="Paste base64 image string:"
        inputType="multiline"
        placeholder="iVBORw0KGgoAAAANSUhEUgAA..."
      />
      <MethodModal
        visible={modal === 'generate'}
        onClose={() => setModal(null)}
        onSubmit={handleGenerateQR}
        title="Generate QR Code"
        inputLabel="Enter text to encode:"
        inputType="text"
        placeholder="https://example.com"
      />
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
          {result && result.base64 && (
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyBase64} activeOpacity={0.8}>
              <Text style={styles.copyButtonText}>Copy Base64</Text>
            </TouchableOpacity>
          )}
          {copyMsg ? <Text selectable style={styles.copyMsg}>{copyMsg}</Text> : null}
        </View>
      )}
      <ScrollView style={styles.resultBox} contentContainerStyle={{ padding: 12 }}>
        {loading ? (
          <Text style={styles.resultText}>Loading...</Text>
        ) : result ? (
          <Text selectable style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
        ) : (
          <Text style={styles.resultText}>No result yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F5F6FA',
    marginBottom: 24,
    letterSpacing: 1.2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#246BFD',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginHorizontal: 8,
    marginBottom: 4,
    shadowColor: '#246BFD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
  copyButton: {
    backgroundColor: '#246BFD',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: 'center',
  },
  copyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  copyMsg: {
    color: '#7CFCAC',
    fontSize: 13,
    marginTop: 4,
    alignSelf: 'center',
  },
  resultBox: {
    flex: 1,
    width: '94%',
    backgroundColor: '#23242A',
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#23242A',
    overflow: 'hidden',
  },
  resultText: {
    color: '#F5F6FA',
    fontFamily: 'Menlo',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
});


const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 24,
    width: 320,
    alignItems: 'center',
    maxHeight: '85%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F5F6FA',
    marginBottom: 12,
  },
  label: {
    color: '#8F93A2',
    fontSize: 14,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#181A20',
    color: '#F5F6FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    padding: 10,
    width: '100%',
    minHeight: 40,
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 80,
    maxHeight: 120,
    textAlignVertical: 'top',
  },
  inputScroll: {
    width: '100%',
    maxHeight: 120,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#246BFD',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default App;