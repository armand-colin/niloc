import { useContext, useEffect, useState } from "react"
import { AppContext } from "./contexts/AppContext"
import { ConnectionList, Identity, Presence, User } from "@niloc/core"
import { PostItsView } from "./ui/postItsView/PostItsView"

function useConnectionList(list: ConnectionList) {
    const [users, setUsers] = useState<Identity[]>([])

    useEffect(() => {
        function update() {
            setUsers([...list.users()])
        }

        list.on('connected', update)
        list.on('disconnected', update)

        update()

        return () => {
            list.off('connected', update)
            list.off('disconnected', update)
        }
    }, [list])

    return users
}

function usePresence(presence: Presence<User>) {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {
        function update() {
            setUsers([...presence.users])
        }

        presence.on('connected', update)
        presence.on('disconnected', update)
        
        update()
        
        return () => {
            presence.off('connected', update)
            presence.off('disconnected', update)
        }
    }, [presence])

    return users
} 

export function Home() {
    const { framework } = useContext(AppContext)

    const connected = useConnectionList(framework.connectionList)
    const users = usePresence(framework.presence)

    return <>
        <h2>Connected</h2>
        <ul>
            {
                connected.map(user => <li key={user.userId}>{user.userId}</li>)
            }
        </ul>
        <h2>Users</h2>
        <ul>
            {
                users.map(user => <li key={user.identity.userId}>{user.identity.userId}</li>)
            }
        </ul>
        <h2>PostIts</h2>
        <PostItsView />
    </>
}