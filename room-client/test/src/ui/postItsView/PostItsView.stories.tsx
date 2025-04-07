import { PostItsView } from "./PostItsView";
export default {
    title: "PostItsView",
}

export const Template = () => {
    return <>
        <style>{`
            .container {

            }
        `}</style>

        <div className="container">
            <PostItsView />
        </div>
    </>
}
