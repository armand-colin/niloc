type Constructor<T> = {
    new (): T;
} | {
    new (injector: Provider): T;
};
export declare class Provider {
    private _types;
    private _history;
    get<T>(type: Constructor<T>): T;
    set<T>(type: Constructor<T>, instance: any): void;
    private _get;
}
export {};
