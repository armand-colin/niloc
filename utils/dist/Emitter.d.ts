export type Callback<T> = (data: T) => void;
export interface IEmitter<Events> {
    once<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    off<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    on<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    offOnce<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void;
    removeAllListeners(): void;
}
export declare class Emitter<Events> implements IEmitter<Events> {
    private _listeners;
    private _onceListeners;
    on<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    off<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    once<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    offOnce<K extends keyof Events & string>(event: K, callback: Callback<Events[K]>): void;
    emit<K extends keyof Events & string>(event: K, data: Events[K]): void;
    removeAllListeners(): void;
}
