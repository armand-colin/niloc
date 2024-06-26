import { Iter } from "@niloc/utils"
import { Serie } from "./Serie"

export class Graph {

    private _context: CanvasRenderingContext2D

    constructor(protected canvas: HTMLCanvasElement) {
        this._context = canvas.getContext('2d')!
    }

    clear() {
        this._context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    renderSeries(serie: Serie) {
        const length = serie.length

        this._context.beginPath()

        for (const [i, value] of Iter.enumerate(serie)) {
            const x = i * this.canvas.width / length
            const y = this.canvas.height * (1 - value)

            if (i === 0)
                this._context.moveTo(x, y)
            else
                this._context.lineTo(x, y)
        }

        this._context.closePath()
    }

}