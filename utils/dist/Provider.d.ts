type AnyConstructor<T = any> = Provider.Constructor<T> | Provider.AsyncConstructor<T>;
export declare class Provider {
    private _types;
    private _history;
    private _lockEmitter;
    private _locked;
    get<T>(type: Provider.Constructor<T>): T;
    set<T>(type: AnyConstructor<T>, instance: T): void;
    lock(): void;
    unlock(): void;
    private _waitForRelease;
    getAsync<T>(type: Provider.AsyncConstructor<T>): Promise<T>;
    private _addToHistory;
    private _removeFromHistory;
    private _get;
}
export declare namespace Provider {
    type Constructor<T> = {
        name: string;
        new (): T;
    } | {
        name: string;
        new (provider: Provider): T;
    };
    type AsyncConstructor<T> = {
        name: string;
        asyncConstructor(provider: Provider): Promise<T>;
    } | {
        name: string;
        asyncConstructor(): Promise<T>;
    };
}
export {};
