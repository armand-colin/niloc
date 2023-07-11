import { useField } from "../core/useField"
import { State } from "../state/State"
import "./Canvas.scss"

export const Canvas = () => {
    const presence = State.instance.presence
    
    const users = presence.useUsers()

    function onMouseMove(e: MouseEvent) {
        const user = presence.user
        
        user.position.set({
            x: e.clientX,
            y: e.clientY
        })

        presence.tick()
    }

    return <div 
        class="Canvas"
        onMouseMove={onMouseMove}
    >

    </div>
}