export type Id<T> = T extends {
    id: infer U;
} ? U : never;
