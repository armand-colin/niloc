import { query } from "../src/query"
import { Table } from "../src/Table"

const organization = Table.create("organization", {
    id: query.string,
    name: query.string
})

const user = Table.create("user", {
    id: query.string,
    name: query.string,
    created: query.date,
    organizationId: organization.id.type
})

const s = query.select(
    user.id.as("toto"),
    user.name,
    user.organizationId.as("zizi")
).from(user)
    .join(organization).on(organization.id, user.organizationId)
    .where(
        user.id.equals(organization.id)
            .and(user.id.equals("toto"))
            .and(user.created.equals(new Date()))
            .and(user.id.in(["1", "2"]))
            .and(user.id.in(query.select(user.id).from(user)))
    )  

const str = s.string()