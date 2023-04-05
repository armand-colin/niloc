export declare namespace DrawActions {
    type Pen = {
        type: "pen";
        color: string;
        thickness: number;
        start: {
            x: number;
            y: number;
        };
        end: {
            x: number;
            y: number;
        };
    };
    type Any = Pen;
}
