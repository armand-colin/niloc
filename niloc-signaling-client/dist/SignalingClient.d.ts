import { Emitter } from "utils";
export interface SignalingClientEvents {
    signal: {
        peerId: string;
        signal: any;
    };
    connected: void;
    disconnected: void;
    error: any;
}
interface SignalingClientOpts {
    path: string;
    room: string;
}
export declare class SignalingClient {
    private _id;
    private _socket;
    private _opts;
    private _emitter;
    constructor(id: string, opts: SignalingClientOpts);
    emitter(): Emitter<SignalingClientEvents>;
    signal(peerId: string, signal: any): void;
    private _createIO;
}
export {};
