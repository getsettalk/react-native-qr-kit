#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(QRKitModule, NSObject)

RCT_EXTERN_METHOD(decodeBase64:(NSString *)base64Str
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(decodeQR:(NSString *)path
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(decodeMultiple:(NSString *)path
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(generateQRCode:(NSString *)data
                  size:(NSInteger)size
                  resolver:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)


@end
