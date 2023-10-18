import { For, createSignal } from "solid-js";
import { Framework } from "../../core/Framework";
import { User } from "../../core/User";

export function UsersView(props: { framework: Framework }) {
    const [users, setUsers] = createSignal(props.framework.presence.users())

    props.framework.presence.emitter().on('changed', () => {
        setUsers(props.framework.presence.users())
    })

    function onMouseMove(e: MouseEvent) {
        const user = props.framework.presence.user()

        user.position = {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
        }
    }

    document.body.addEventListener('mousemove', onMouseMove)

    return <ul class="UsersView">
        <For each={users()}>
            {user => <UserView user={user} />}
        </For>
    </ul>
}

function UserView(props: { user: User }) {
    const [user, setUser] = createSignal(props.user, { equals: false })

    function onChange() {
        setUser(props.user)
    }

    props.user.register(onChange)

    return <>
        <li class="UserView">
            {user().name} ({user().id()})
        </li>
        <div
            style={{
                position: "fixed",
                left: (user().position.x * 100) + "vw",
                top: (user().position.y * 100) + "vh",
            }}
        >
            {user().name}
        </div>
    </>
}