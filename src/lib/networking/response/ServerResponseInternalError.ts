import ServerResponse from "./ServerResponse";

export default class ServerResponseInternalError extends ServerResponse {

    constructor(event: string, error: string, fatal: boolean = false) {
        super(event, "internal.error", { error, fatal });
    }

}