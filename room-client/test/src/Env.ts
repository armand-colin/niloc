function read(key: string) {
    if (!import.meta.env[key])
        throw new Error("ROOM_URL was not provoded")

    return import.meta.env[key]
}

export const Env = {
    ROOM_URL: read("VITE_ROOM_URL")
}