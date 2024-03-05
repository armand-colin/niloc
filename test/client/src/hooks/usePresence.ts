import { Presence } from "@niloc/core";
import { User } from "../User";
import { useEffect, useState } from "react";

export function usePresence(presence: Presence<User>): User[] {
    const [users, setUsers] = useState<User[]>([])

    useEffect(() => {

        function update() {
            setUsers([...presence.users])
        }

        presence.on('changed',update)
        
        return () => {
            presence.off('changed',update)
        }

    }, [presence])

    return users
}