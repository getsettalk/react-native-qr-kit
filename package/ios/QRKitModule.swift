//
//  QRKitModule.swift
//  AweREACT
//
//  Developed by Sujeet Kumar @getsettalk
//

import Foundation
import UIKit
import React
import AVFoundation
import Vision

@objc(QRKitModule)
class QRKitModule: NSObject {
    
    // MARK: - decodeBase64 (Matching Android)
    @objc func decodeBase64(_ base64Str: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            guard let data = Data(base64Encoded: base64Str) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "Base64Error",
                    "message": "Invalid base64 string"
                ]
                resolver(errorMap)
                return
            }
            
            guard let image = UIImage(data: data),
                  let ciImage = CIImage(image: image) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "ImageError",
                    "message": "Could not load image from base64"
                ]
                resolver(errorMap)
                return
            }
            
            // Perform detection (single QR assumption like Android)
            let detectionResult = detectBarcodes(in: ciImage)
            if let firstResult = detectionResult.first {
                let successMap: [String: Any] = [
                    "success": true,
                    "data": firstResult["data"] ?? NSNull(),
                    "format": firstResult["format"] ?? "QR_CODE",
                    "points": firstResult["points"] ?? [] // Include points even for base64
                ]
                resolver(successMap)
            } else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "NotFoundException",
                    "message": "No QR code detected in the image"
                ]
                resolver(errorMap)
            }
        } catch let error {
            let errorMap: [String: Any] = [
                "success": false,
                "errorType": String(describing: type(of: error)),
                "message": error.localizedDescription,
                "details": error.localizedDescription,
                "stack": Thread.callStackSymbols.joined(separator: "\n")
            ]
            resolver(errorMap)
        }
    }
    
    // MARK: - decodeQR (Matching Android - single decode)
    @objc func decodeQR(_ path: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        print("QRKit: decodeQR called with path: \(path)")
        
        do {
            var cleanPath = path
            if cleanPath.hasPrefix("file://") {
                cleanPath = String(cleanPath.dropFirst(7))
            }
            
            guard FileManager.default.fileExists(atPath: cleanPath) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "FileError",
                    "message": "Could not load image from path: \(path)"
                ]
                resolver(errorMap)
                return
            }
            
            guard let image = UIImage(contentsOfFile: cleanPath),
                  let ciImage = CIImage(image: image) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "ImageError",
                    "message": "Could not load or convert image from path: \(path)"
                ]
                resolver(errorMap)
                return
            }
            
            print("QRKit: Image loaded with size: \(image.size)")
            
            // Perform detection
            let detectionResult = detectBarcodes(in: ciImage)
            if let firstResult = detectionResult.first,
               let data = firstResult["data"] as? String,
               let format = firstResult["format"] as? String {
                
                // Always include points (even if empty)
                let pointsArray = firstResult["points"] as? [String] ?? []
                
                let successMap: [String: Any] = [
                    "success": true,
                    "data": data,
                    "error": NSNull(),
                    "format": format,
                    "points": pointsArray // Fixed: Always return points array
                ]
                
                print("QRKit: SUCCESS - Data: \(data.prefix(50))..., Format: \(format), Points: \(pointsArray.count)")
                resolver(successMap)
            } else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "errorType": "NotFoundException",
                    "message": "No QR code detected in the image"
                ]
                resolver(errorMap)
            }
        } catch let error {
            let errorMap: [String: Any] = [
                "success": false,
                "errorType": String(describing: type(of: error)),
                "message": error.localizedDescription,
                "details": error.localizedDescription,
                "stack": Thread.callStackSymbols.joined(separator: "\n")
            ]
            resolver(errorMap)
        }
    }
    
    // MARK: - decodeMultiple (Matching Android)
    @objc func decodeMultiple(_ path: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        do {
            var cleanPath = path
            if cleanPath.hasPrefix("file://") {
                cleanPath = String(cleanPath.dropFirst(7))
            }
            
            guard FileManager.default.fileExists(atPath: cleanPath) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "message": "Could not load image from path: \(path)"
                ]
                resolver(errorMap)
                return
            }
            
            guard let image = UIImage(contentsOfFile: cleanPath),
                  let ciImage = CIImage(image: image) else {
                let errorMap: [String: Any] = [
                    "success": false,
                    "message": "Could not load or convert image from path: \(path)"
                ]
                resolver(errorMap)
                return
            }
            
            // Perform detection
            let detectionResult = detectBarcodes(in: ciImage)
            let resultsArray = detectionResult.map { result -> [String: Any] in
                [
                    "data": result["data"] ?? NSNull(),
                    "format": result["format"] ?? NSNull(),
                    "points": result["points"] ?? [] // Include points for multiple too
                ]
            }
            
            let successMap: [String: Any] = [
                "success": true,
                "results": resultsArray
            ]
            resolver(successMap)
        } catch let error {
            let errorMap: [String: Any] = [
                "success": false,
                "message": error.localizedDescription
            ]
            resolver(errorMap)
        }
    }
    
    // MARK: - generateQRCode (Matching Android)
    @objc func generateQRCode(_ data: String, size: Int, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
        guard let filter = CIFilter(name: "CIQRCodeGenerator") else {
            let errorMap: [String: Any] = [
                "success": false,
                "message": "Could not create QR code generator"
            ]
            resolver(errorMap)
            return
        }
        
        filter.setValue(data.data(using: .utf8), forKey: "inputMessage")
        filter.setValue("H", forKey: "inputCorrectionLevel")
        
        guard let ciImage = filter.outputImage else {
            let errorMap: [String: Any] = [
                "success": false,
                "message": "Could not generate QR code image"
            ]
            resolver(errorMap)
            return
        }
        
        let transform = CGAffineTransform(scaleX: CGFloat(size) / ciImage.extent.width, y: CGFloat(size) / ciImage.extent.height)
        let scaledImage = ciImage.transformed(by: transform)
        
        let context = CIContext()
        guard let cgImage = context.createCGImage(scaledImage, from: scaledImage.extent) else {
            let errorMap: [String: Any] = [
                "success": false,
                "message": "Could not create CGImage"
            ]
            resolver(errorMap)
            return
        }
        
        let bitmap = UIImage(cgImage: cgImage)
        guard let pngData = bitmap.pngData() else {
            let errorMap: [String: Any] = [
                "success": false,
                "message": "Could not compress to PNG"
            ]
            resolver(errorMap)
            return
        }
        
        let base64Str = pngData.base64EncodedString(options: [])
        
        let successMap: [String: Any] = [
            "success": true,
            "base64": base64Str,
            "format": "QR_CODE" // Added format for consistency
        ]
        resolver(successMap)
    }
    
    // MARK: - Core Detection Logic (Fixed Points)
    private func detectBarcodes(in ciImage: CIImage) -> [[String: Any]] {
        var results: [[String: Any]] = []
        
        // Try Vision first
        results = detectWithVision(in: ciImage)
        if !results.isEmpty { return results }
        
        // Fallback to enhanced image
        let enhancedImage = enhanceImageForDetection(ciImage)
        results = detectWithVision(in: enhancedImage)
        if !results.isEmpty { return results }
        
        // Fallback to Legacy CIDetector
        results = detectWithCIDetector(in: ciImage)
        if !results.isEmpty { return results }
        
        // Legacy on enhanced
        results = detectWithCIDetector(in: enhancedImage)
        return results
    }
    
    // MARK: - Vision Detection (Fixed Points)
    private func detectWithVision(in ciImage: CIImage) -> [[String: Any]] {
        let requestHandler = VNImageRequestHandler(ciImage: ciImage, options: [:])
        let barcodeRequest = VNDetectBarcodesRequest()
        barcodeRequest.symbologies = [.qr] // Focus on QR like Android
        
        do {
            try requestHandler.perform([barcodeRequest])
            guard let observations = barcodeRequest.results as? [VNBarcodeObservation] else {
                print("QRKit: No Vision observations found")
                return []
            }
            
            print("QRKit: Vision found \(observations.count) observations")
            
            return observations.compactMap { observation -> [String: Any]? in
                guard let payload = observation.payloadStringValue else {
                    print("QRKit: Observation has no payload")
                    return nil
                }
                
                let format = mapSymbologyToAndroidFormat(observation.symbology.rawValue)
                
                // FIXED: Always calculate points using boundingBox
                let boundingBox = observation.boundingBox
                let imageSize = ciImage.extent.size
                
                // Convert normalized coordinates (0-1) to image coordinates
                let topLeft = CGPoint(
                    x: boundingBox.minX * imageSize.width,
                    y: (1 - boundingBox.minY) * imageSize.height // Flip Y coordinate
                )
                let topRight = CGPoint(
                    x: boundingBox.maxX * imageSize.width,
                    y: (1 - boundingBox.minY) * imageSize.height
                )
                let bottomRight = CGPoint(
                    x: boundingBox.maxX * imageSize.width,
                    y: (1 - boundingBox.maxY) * imageSize.height
                )
                let bottomLeft = CGPoint(
                    x: boundingBox.minX * imageSize.width,
                    y: (1 - boundingBox.maxY) * imageSize.height
                )
                
                let points = [
                    "\(topLeft.x),\(topLeft.y)",      // Top Left
                    "\(topRight.x),\(topRight.y)",    // Top Right
                    "\(bottomRight.x),\(bottomRight.y)", // Bottom Right
                    "\(bottomLeft.x),\(bottomLeft.y)"  // Bottom Left
                ]
                
                print("QRKit: Vision points calculated: \(points)")
                
                return [
                    "data": payload,
                    "format": format,
                    "points": points, // FIXED: Always include points
                    "confidence": observation.confidence
                ]
            }
        } catch {
            print("QRKit: Vision detection failed: \(error)")
            return []
        }
    }
    
    // MARK: - FIXED: CIDetector Detection with Proper Points
    private func detectWithCIDetector(in ciImage: CIImage) -> [[String: Any]] {
        print("QRKit: Trying CIDetector fallback...")
        
        guard let detector = CIDetector(
            ofType: CIDetectorTypeQRCode,
            context: nil,
            options: [CIDetectorAccuracy: CIDetectorAccuracyHigh]
        ) else {
            print("QRKit: Failed to create CIDetector")
            return []
        }
        
        let features = detector.features(in: ciImage)
        print("QRKit: CIDetector found \(features.count) features")
        
        return features.compactMap { feature -> [String: Any]? in
            guard let qrFeature = feature as? CIQRCodeFeature,
                  let payload = qrFeature.messageString else {
                print("QRKit: Feature is not QR or has no payload")
                return nil
            }
            
            print("QRKit: CIDetector found QR: \(payload.prefix(30))...")
            
            // FIXED: Calculate corner points from bounds to match Android
            let bounds = qrFeature.bounds
            let imageSize = ciImage.extent.size
            
            // Convert CGRect bounds to 4 corner points (normalized to image coordinates)
            let topLeft = CGPoint(
                x: bounds.origin.x * imageSize.width,
                y: (1 - bounds.origin.y) * imageSize.height // Flip Y coordinate
            )
            let topRight = CGPoint(
                x: (bounds.origin.x + bounds.size.width) * imageSize.width,
                y: (1 - bounds.origin.y) * imageSize.height
            )
            let bottomRight = CGPoint(
                x: (bounds.origin.x + bounds.size.width) * imageSize.width,
                y: (1 - (bounds.origin.y + bounds.size.height)) * imageSize.height
            )
            let bottomLeft = CGPoint(
                x: bounds.origin.x * imageSize.width,
                y: (1 - (bounds.origin.y + bounds.size.height)) * imageSize.height
            )
            
            let points = [
                "\(topLeft.x),\(topLeft.y)",      // Top Left
                "\(topRight.x),\(topRight.y)",    // Top Right
                "\(bottomRight.x),\(bottomRight.y)", // Bottom Right
                "\(bottomLeft.x),\(bottomLeft.y)"  // Bottom Left
            ]
            
            print("QRKit: CIDetector points calculated: \(points)")
            
            return [
                "data": payload,
                "format": "QR_CODE",
                "points": points, // FIXED: Now properly returns points
                "confidence": 1.0 // CIDetector doesn't provide confidence
            ]
        }
    }
    
    // MARK: - Image Enhancement
    private func enhanceImageForDetection(_ ciImage: CIImage) -> CIImage {
        var processedImage = ciImage
        
        if let grayscaleFilter = CIFilter(name: "CIPhotoEffectMono") {
            grayscaleFilter.setValue(processedImage, forKey: kCIInputImageKey)
            if let output = grayscaleFilter.outputImage {
                processedImage = output
                print("QRKit: Applied grayscale enhancement")
            }
        }
        
        if let contrastFilter = CIFilter(name: "CIColorControls") {
            contrastFilter.setValue(processedImage, forKey: kCIInputImageKey)
            contrastFilter.setValue(2.0, forKey: kCIInputContrastKey)
            if let output = contrastFilter.outputImage {
                processedImage = output
                print("QRKit: Applied contrast enhancement")
            }
        }
        
        return processedImage
    }
    
    // MARK: - Map Symbology to Android-like Format
    private func mapSymbologyToAndroidFormat(_ symbology: String) -> String {
        switch symbology.lowercased() {
        case "qr": return "QR_CODE"
        default: return symbology.uppercased()
        }
    }
    
    // MARK: - React Native Module Setup
    @objc static func requiresMainQueueSetup() -> Bool {
        return false
    }
}
