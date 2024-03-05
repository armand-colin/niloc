import { Framework } from "@niloc/core"
import { User } from "./User"
import { useNetworkConnected } from "./hooks/useNetworkConnected"
import { ConnectionListView } from "./components/connectionListView/ConnectionListView"

export function FrameworkView(props: { framework: Framework<User> }) {
    const identity = props.framework.router.identity
    const connected = useNetworkConnected(props.framework.network)

    return <div>
        <h1>{identity.userId} {identity.host ? "host" : ""}</h1>
        <p>{connected ? "connected" : "disconnected"}</p>

        <ConnectionListView 
            connectionList={props.framework.connectionList}
        />
    </div>

}