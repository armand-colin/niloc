import { For } from "solid-js"
import { State } from "../state/State"
import { User } from "../core/User"
import { useField } from "../core/useField"

export const UserList = () => {
    const users = State.instance.presence.useUsers()

    return <div class="UserList">
        <p>Users</p>
        <For each={users()}>
            {user => <UserView user={user} />}
        </For>
    </div>
}

const UserView = (props: { user: User }) => {
    const name = useField(props.user.name)
    const color = useField(props.user.color)

    return <div
        class="UserView"
        style={{
            "--color": color()
        }}
    >
        <p>{name()}</p>
    </div>
}