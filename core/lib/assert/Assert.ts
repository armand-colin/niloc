import { AssertContext } from "./AssertContext"


export abstract class Assert {

    static __setAssertContext(assert: Assert, context: AssertContext) {
        assert._context = context
    }

    private _context: AssertContext | null = null

    assert(): void {
        if (!this._context)
            throw new Error("Assertion has not been handled. See AssertionHandler for more details")
        
        this.assertWithContext(this._context)
    }

    protected abstract assertWithContext(context: AssertContext): void

}