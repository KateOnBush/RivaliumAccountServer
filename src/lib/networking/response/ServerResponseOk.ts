import ServerMessage from "../../types/ServerMessage";
import ServerResponse from "../ServerResponse";

export default class ServerResponseOk extends ServerResponse {

    constructor(event: string, content: any = {}) {
        super(event, "ok", content);
    }

}