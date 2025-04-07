export class Env {

    private static _get(key: string): string {
        const value = process.env[key]
        if (!value)
            throw "Missing env variable " + key
        
        return value
    }

    static get DATABASE_PATH() { return this._get("DATABASE_PATH") }


}