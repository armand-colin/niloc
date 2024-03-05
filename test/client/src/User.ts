import { User as NilocUser, field } from '@niloc/core'

export class User extends NilocUser {

    @field.string()
    name!: string

}
