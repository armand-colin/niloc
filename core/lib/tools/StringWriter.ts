class Line {
    private _string: string = ""

    write(string: string) {
        this._string += string
    }

    toString(indent: number) {
        return '  '.repeat(indent) + this._string
    }
}

export class StringWriter {

    private _indent: number = 0
    private _string: string = ""
    private _line: Line = new Line()

    write(string: string) {
        this._line.write(string)
    }

    writeLine(string: string) {
        this._line.write(string)
        this.nextLine()
    }

    nextLine() {
        this._string += this._line.toString(this._indent) + '\n'
        this._line = new Line()
    }

    startIndent() {
        this._indent++
    }

    endIndent() {
        this._indent--
    }

    toString() {
        this.nextLine()
        return this._string
    }

}