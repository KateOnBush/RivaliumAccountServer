import IClientMessage from "../interfaces/IClientMessage";

export default class ServerMessage {

    content: any = {};
    reply?: string;
    status?: string;
    event: string;

    constructor(event: string, content: any) {
        this.event = event;
        this.content = content;
    }

    bake() {
        return JSON.stringify(this) + "\0";
    }

}