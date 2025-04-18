import { type Property } from "./Property";

export type PropertyPipe<T, U> = (property: Property<T>) => Property<U>