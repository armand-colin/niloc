import type { Observable } from "./Observable";
export declare class Pipe<T> {
    protected readonly observer: Observable<T>;
    constructor(observer: Observable<T>);
}
