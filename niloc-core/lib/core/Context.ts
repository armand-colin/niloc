export class Context {

    readonly host: boolean
    readonly userId: string

    constructor(userId: string, host: boolean) {
        this.host = host
        this.userId = userId
    }

}