type Split = {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
};
export declare class Duration {
    readonly milliseconds: number;
    constructor(milliseconds: number);
    static split(split: Partial<Split>): Duration;
    static milliseconds(milliseconds: number): Duration;
    static seconds(seconds: number): Duration;
    static minutes(minutes: number): Duration;
    static hours(hours: number): Duration;
    static days(days: number): Duration;
    get seconds(): number;
    get minutes(): number;
    get hours(): number;
    get days(): number;
    split(): Split;
    add(other: Duration): Duration;
    subtract(other: Duration): Duration;
    equals(other: Duration): boolean;
}
export {};
