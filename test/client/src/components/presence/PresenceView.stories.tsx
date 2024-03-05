import { PresenceView } from "./PresenceView";
export default {
    title: "PresenceView",
}

export const Template = () => {
    return <>
        <style>{`
            .container {

            }
        `}</style>

        <div className="container">
            <PresenceView />
        </div>
    </>
}
