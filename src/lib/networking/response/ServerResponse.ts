import Message from "../../types/Message";

export default class ServerResponse extends Message {

    constructor(repliesToEvent: string, status: string, content: any) {
        super("reply", content);
        this.r = repliesToEvent;
        this.s = status;
    }

}