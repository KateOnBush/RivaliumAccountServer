import ServerResponse from "./ServerResponse";

export default class ServerResponseError extends ServerResponse {

    constructor(event: string, erratum: string = "error") {
        super(event, "error", {error: erratum });
    }

}