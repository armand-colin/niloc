import { Network } from "@niloc/core";
import { useEffect, useState } from "react";

export function useNetworkConnected(network: Network) {
    const [connected, setConnected] = useState(network.connected)

    useEffect(() => {

        function update() {
            setConnected(network.connected)
        }

        network.on('connected', update)
        network.on('disconnected', update)

        return () => {
            network.off('connected', update)
            network.off('disconnected', update)
        }

    }, [network])

    return connected
}