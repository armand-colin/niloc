import { Address, Message } from "../main";
export interface Channel<T> {
    post(address: Address, message: T): void;
    addListener(callback: (message: Message<T>) => void): void;
    removeListener(callback: (message: Message<T>) => void): void;
}
export declare namespace Channel {
    function split<N extends number>(channel: Channel<any>, n: number): Channel<any>[] & {
        length: N;
    };
}
