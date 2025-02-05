import { Observable, Subject } from "rxjs";
import { RSocketConfig } from '../core/config/rsocket-config';
import { Payload } from '../core/protocol/payload';
import { MimeTypeRegistry } from "./rsocket-mime.types";


export enum RSocketState {
    Disconnected = 'Disconnected',
    Connected = 'Connected',
    Error = 'Error',
    Reconnecting = 'Reconnecting'
}

export enum BackpressureStrategy {
    BufferDelay,
    Drop,
}

export type RequestResponseHandler = (payload: Payload) => Observable<Payload>;
/**
 * Use the requester to pull elements from the stream => "backpressure" support
 */
export type RequestStreamHandler = (payload: Payload) => { stream: Observable<Payload>, backpressureStrategy: BackpressureStrategy };
export type RequestFNFHandler = (payload: Payload) => void;

export interface RSocket {

    establish(config: RSocketConfig<any, any>): void;
    close(): void;
    state(): Observable<RSocketState>;

    requestResponse(payload: Payload): Observable<Payload>;
    requestStream(payload: Payload): Observable<Payload>;
    requestStream(payload: Payload, requester?: Observable<number>): Observable<Payload>;
    requestFNF(payload: Payload): void;
    setRequestResponseHandler(handler: RequestResponseHandler);
    setRequestStreamHandler(handler: RequestStreamHandler);
    setRequestFNFHandler(handler: RequestFNFHandler);

    readonly mimeTypeRegistry: MimeTypeRegistry;
}