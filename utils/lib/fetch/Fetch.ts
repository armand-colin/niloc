import { JSON } from "../json/JSON";
import { Result } from "../main";


export namespace Fetch {

    export enum Status {
        Ok = 200,
        Created = 201,
        Accepted = 202,
        NoContent = 204,
        BadRequest = 400,
        Unauthorized = 401,
        Forbidden = 403,
        NotFound = 404,
        InternalServerError = 500,
        BadGateway = 502,
        ServiceUnavailable = 503,
        GatewayTimeout = 504,
    }

    export class Response {

        constructor(readonly nativeResponse: globalThis.Response) { }

        json<T>(): Promise<Result<T, JSONParseError>> {
            return Result.promise(this.nativeResponse.text())
                .then(result => {
                    if (result.ok)
                        return result

                    return Result.error(new JSONParseError(new JSON.ParseError(result.error)))
                })

        }

    }

    export class NetworkError {

        constructor(readonly nativeError: Error) { }

    }

    export class StatusError {
        constructor(
            readonly status: Status,
            readonly statusText: string,
            readonly response: Response
        ) { }
    }

    export class JSONParseError {

        constructor(readonly error: JSON.ParseError) { }

    }

    export function raw(url: string, options?: RequestInit): Promise<Result<Response, NetworkError | StatusError>> {
        return Result.promise<globalThis.Response, Error>(fetch(url, options))
            .then(result => {
                if (!result.ok)
                    return Result.error(new NetworkError(result.error))

                const response = result.value
                if (response.ok)
                    return Result.ok(new Response(response))

                return Result.error(new StatusError(
                    response.status as Status,
                    response.statusText,
                    new Response(response))
                )
            })
    }

}