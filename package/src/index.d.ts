import type { IQRKit, QRDecodeResponse, QRDecodeMultipleResponse, QRGenerateResponse } from './types';

declare const QRKitWrapper: IQRKit;

export default QRKitWrapper;
export type { IQRKit, QRDecodeResponse, QRDecodeMultipleResponse, QRGenerateResponse } from './types';
export type { QRFormat, ErrorType, QRDecodeSuccess, QRDecodeError, QRDecodeMultipleSuccess, QRDecodeMultipleError, QRGenerateSuccess, QRGenerateError } from './types';
