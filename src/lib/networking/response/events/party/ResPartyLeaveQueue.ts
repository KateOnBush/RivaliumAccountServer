import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";
import User from "../../../../components/user/User";

export default class ResPartyLeaveQueue extends Message {
    constructor() {
        super("party.leave.queue");
    }

}