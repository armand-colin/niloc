import { ConnectionList, Identity } from "@niloc/core";
import { useEffect, useState } from "react";

export function useConnectionList(connectionList: ConnectionList): Identity[] {

    const [connections, setConnections] = useState<Identity[]>(() => [...connectionList.users()])

    useEffect(() => {

        function update() {
            console.log('update', [...connectionList.users()])  
            setConnections([...connectionList.users()])
        }

        connectionList.on('connected', update)
        connectionList.on('disconnected', update)

        update()

        return () => {
            connectionList.off('connected', update)
            connectionList.off('disconnected', update)
        }
    }, [connectionList])

    return connections

}