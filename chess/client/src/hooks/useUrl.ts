import { useEffect, useState } from "react";

export function useUrl(url: string): string | null {
    const [result, setResult] = useState<string | null>(null)

    useEffect(() => {
        let done = false
        setResult(null)
        fetch(url)
            .then(response => {
                if (response.ok)
                    response.text().then(text => {
                        if (done)
                            return
                        setResult(text)
                    })
                setResult(null)
            })
            .catch(e => setResult(null))
            
        return () => {
            done = true
        }
    }, [url])

    return result
}