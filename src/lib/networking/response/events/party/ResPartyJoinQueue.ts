import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";
import User from "../../../../components/user/User";

export default class ResPartyJoinQueue extends Message {
    constructor(queueName: string) {
        super("party.join.queue", {queue: queueName});
    }

}