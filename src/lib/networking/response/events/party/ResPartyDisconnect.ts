import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";
import User from "../../../../components/user/User";

export default class ResPartyDisconnect extends Message {
    constructor(user: User, newParty: Party) {
        super("party.disconnect", {
            user: {id: user.getID(), username: user.username}
        });
    }

}