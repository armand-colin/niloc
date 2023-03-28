export namespace DrawActions {

    export type Pen = {
        type: "pen"
        color: string
        thickness: number
        start: { x: number, y: number }
        end: { x: number, y: number }
    }

    export type Any = Pen

}