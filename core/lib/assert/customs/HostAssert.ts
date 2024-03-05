import { Assert } from "../Assert";
import { AssertContext } from "../AssertContext";

export class HostAssert extends Assert {

    protected assertWithContext(context: AssertContext): void {
        if (!context.identity.host)
            throw new Error("Trying to call a host method from a non-host identity")
    }

}