type KeyOfSelf<T> = T[keyof T]

export type KeyOfType<T, O> = KeyOfSelf<{
    [K in keyof O]: O[K] extends T ? K : never
}> & string