import ServerMessage from "../types/ServerMessage";

export default class ServerResponse extends ServerMessage {

    constructor(repliesToEvent: string, status: string, content: any) {
        super("reply", content);
        this.reply = repliesToEvent;
        this.status = status;
        this.content = content;
    }

}