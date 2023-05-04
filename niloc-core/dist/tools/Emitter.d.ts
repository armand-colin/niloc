type Callback<T> = T extends void ? () => void : (data: T) => void;
type VoidKeys<T> = {
    [K in keyof T]: T[K] extends void ? K : never;
}[keyof T];
export interface Emitter<Events> {
    once<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    off<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    on<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    offOnce<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    emit<K extends VoidKeys<Events>>(event: K): void;
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void;
    removeAllListeners(): void;
}
export declare class Emitter<Events> implements Emitter<Events> {
    private _listeners;
    private _onceListeners;
    emit<K extends VoidKeys<Events>>(event: K): void;
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void;
}
export {};
