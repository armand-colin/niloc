import { Identity } from "../core/Identity";
import { Assert } from "./Assert";
import { AssertContext } from "./AssertContext";

export class AssertHandler {

    private _context: AssertContext

    constructor(protected readonly identity: Identity) {
        this._context = {
            identity
        }
    }

    infuse(object: any) {
        for (const key in object) {
            const assertion = object[key]
            if (!(assertion instanceof Assert))
                return

            Assert.__setAssertContext(assertion, this._context)
        }
    }

}