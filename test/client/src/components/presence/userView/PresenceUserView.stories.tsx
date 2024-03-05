import { PresenceUserView } from "./PresenceUserView";
export default {
    title: "PresenceUserView",
}

export const Template = () => {
    return <>
        <style>{`
            .container {

            }
        `}</style>

        <div className="container">
            <PresenceUserView />
        </div>
    </>
}
