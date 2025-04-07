import sqlite3 from "sqlite3"
import { Env } from "./Env"

export class Database {

    private _database: sqlite3.Database

    constructor() {
        this._database = new sqlite3.Database(Env.DATABASE_PATH, (error => {
            if (error)
                throw new Error(error.message)
        }))
    }

    query<T>(sql: string, params?: any[]) {
        return new Promise((resolve, reject) => {
            this._database.all<T>(sql, params, (error, rows) => {
                if (error)
                    reject(error)

                resolve(rows)
            })
        })
    }

}