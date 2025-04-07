import { Database } from "./Database";

export namespace Migration {

    export async function apply(database: Database) {

        database.query(/*sql*/`
            CREATE TABLE IF NOT EXISTS user (
                id TEXT NOT NULL PRIMARY KEY,
                email TEXT NOT NULL,
                provider INTEGER NOT NULL
            )
        `)

        database.query(/*sql*/`
            CREATE TABLE IF NOT EXISTS credentials (
                user_id TEXT NOT NULL PRIMARY KEY,
                password TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id)
            )
        `)

    }

}