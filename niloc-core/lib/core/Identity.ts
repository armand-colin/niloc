export type SerializedIdentity = {
    userId: string
    host: boolean
}

export class Identity {

    readonly host: boolean
    readonly userId: string

    static deserialize(data: SerializedIdentity): Identity {
        return new Identity(data.userId, data.host)
    }

    constructor(userId: string, host: boolean = false) {
        this.host = host
        this.userId = userId
    }

    serialize() {
        return {
            userId: this.userId,
            host: this.host
        }
    }

}
