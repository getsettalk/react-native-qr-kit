package com.qrkit

import android.graphics.BitmapFactory
import android.graphics.Bitmap
import com.facebook.react.bridge.*
import com.google.zxing.*
import android.util.Log
import com.google.zxing.common.HybridBinarizer
import com.google.zxing.RGBLuminanceSource

class QRKitModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "QRKit"
    }


    @ReactMethod
    fun decodeBase64(base64Str: String, promise: Promise) {
        try {
            val decodedBytes = android.util.Base64.decode(base64Str, android.util.Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.size)

            val intArray = IntArray(bitmap.width * bitmap.height)
            bitmap.getPixels(intArray, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)

            val source = RGBLuminanceSource(bitmap.width, bitmap.height, intArray)
            val bBitmap = BinaryBitmap(HybridBinarizer(source))
            val reader = MultiFormatReader()
            val result = reader.decode(bBitmap)

            val map = Arguments.createMap()
            map.putBoolean("success", true)
            map.putString("data", result.text)
            promise.resolve(map)
        } catch (e: Exception) {
            val error = Arguments.createMap()
            error.putBoolean("success", false)
            error.putString("message", e.localizedMessage)
            promise.resolve(error)
        }
    }

   

    @ReactMethod
    fun decodeQR(path: String, promise: Promise) {
        Log.d("QRKit", "decodeQR called with path: $path")
        try {
            // Remove the "file://" prefix if it exists
            var cleanPath = path
            if (cleanPath.startsWith("file://")) {
                cleanPath = cleanPath.substring(7)
            }
            val bitmap = BitmapFactory.decodeFile(cleanPath)
            if (bitmap == null) {
                val errorMap = Arguments.createMap()
                errorMap.putBoolean("success", false)
                errorMap.putString("errorType", "FileError")
                errorMap.putString("message", "Could not load image from path: $path")
                promise.resolve(errorMap)
                return
            }
            Log.d("QRKit", "Bitmap loaded: ${bitmap != null}, width: ${bitmap.width}, height: ${bitmap.height}")
            val intArray = IntArray(bitmap.width * bitmap.height)
            bitmap.getPixels(intArray, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)

            val source = RGBLuminanceSource(bitmap.width, bitmap.height, intArray)
            val bBitmap = BinaryBitmap(HybridBinarizer(source))
            val reader = MultiFormatReader()

            val result = reader.decode(bBitmap)
            val successMap = Arguments.createMap()
            successMap.putBoolean("success", true)
            successMap.putString("data", result.text)
            successMap.putString("error", null)
            successMap.putString("format", result.barcodeFormat.toString())
            successMap.putArray("points", Arguments.createArray().apply {
                result.resultPoints?.forEach { pushString("${it.x},${it.y}") }
            })

            promise.resolve(successMap)

       } catch (e: NotFoundException) {
            Log.e("QRKit", "No QR code found: ${e.localizedMessage}")
            // Custom JSON for no QR code found
            val errorMap = Arguments.createMap()
            errorMap.putBoolean("success", false)
            errorMap.putString("errorType", "NotFoundException")
            errorMap.putString("message", "No QR code detected in the image")
            errorMap.putString("details", e.toString())
            errorMap.putString("stack", e.stackTraceToString())
            promise.resolve(errorMap)   

        } catch (e: Exception) {
            Log.e("QRKit", "decodeQR error: ${e.localizedMessage}", e)
            // Generic error JSON
            val errorMap = Arguments.createMap()
            errorMap.putBoolean("success", false)
            errorMap.putString("errorType", e::class.java.simpleName)
            errorMap.putString("message", e.localizedMessage ?: "Unknown error")
            errorMap.putString("details", e.toString())
            errorMap.putString("stack", e.stackTraceToString())
            promise.resolve(errorMap)
        }
    }

    @ReactMethod
    fun decodeMultiple(path: String, promise: Promise) {
        try {
            // Remove the "file://" prefix if it exists
            var cleanPath = path
            if (cleanPath.startsWith("file://")) {
                cleanPath = cleanPath.substring(7)
            }

            val bitmap = BitmapFactory.decodeFile(cleanPath)
            val pixels = IntArray(bitmap.width * bitmap.height)
            bitmap.getPixels(pixels, 0, bitmap.width, 0, 0, bitmap.width, bitmap.height)

            val source = RGBLuminanceSource(bitmap.width, bitmap.height, pixels)
            val bBitmap = BinaryBitmap(HybridBinarizer(source))
            val reader = MultiFormatReader()
            val multiReader = com.google.zxing.multi.GenericMultipleBarcodeReader(reader)

            val results = multiReader.decodeMultiple(bBitmap)
            val arr = Arguments.createArray()
            results.forEach {
                val obj = Arguments.createMap()
                obj.putString("data", it.text)
                obj.putString("format", it.barcodeFormat.toString())
                arr.pushMap(obj)
            }

            val map = Arguments.createMap()
            map.putBoolean("success", true)
            map.putArray("results", arr)
            promise.resolve(map)
        } catch (e: Exception) {
            val error = Arguments.createMap()
            error.putBoolean("success", false)
            error.putString("message", e.localizedMessage)
            promise.resolve(error)
        }
    }

    @ReactMethod
    fun generateQRCode(data: String, size: Int, promise: Promise) {
        try {
            val bitMatrix = MultiFormatWriter().encode(data, BarcodeFormat.QR_CODE, size, size)
            val bmp = Bitmap.createBitmap(size, size, Bitmap.Config.RGB_565)
            for (x in 0 until size) {
                for (y in 0 until size) {
                    bmp.setPixel(x, y, if (bitMatrix[x, y]) android.graphics.Color.BLACK else android.graphics.Color.WHITE)
                }
            }

            // Convert to Base64 to send back
            val outputStream = java.io.ByteArrayOutputStream()
            bmp.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            val base64Str = android.util.Base64.encodeToString(outputStream.toByteArray(), android.util.Base64.DEFAULT)

            val map = Arguments.createMap()
            map.putBoolean("success", true)
            map.putString("base64", base64Str)
            promise.resolve(map)
        } catch (e: Exception) {
            val error = Arguments.createMap()
            error.putBoolean("success", false)
            error.putString("message", e.localizedMessage)
            promise.resolve(error)
        }
    }


}
