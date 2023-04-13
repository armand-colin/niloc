import { Reader, Writer } from "../Synchronize"

export function synchronize() {

    return function (target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get() {
                return this['_' + propertyKey]
            },
            set(value: any) {
                this['_' + propertyKey] = value
                const requester = this._requester ?? this.requester
                requester.change()
            }
        })

        const legacyRead = target.prototype.read
        const legacyWrite = target.prototype.write

        function read(this: any, reader: Reader) {
            this['_' + propertyKey] = reader.read()
            legacyRead?.(reader)
        }

        function write(this: any, writer: Writer) {
            writer.write(this['_' + propertyKey])
            legacyWrite?.(writer)
        }

        target.prototype.read = read
        target.prototype.write = write
    }

}