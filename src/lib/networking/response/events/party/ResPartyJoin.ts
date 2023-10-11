import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";
import User from "../../../../components/user/User";

export default class ResPartyJoin extends Message {
    constructor(user: User, newParty: Party) {
        super("party.join", {
            user: user.getID(),
            party: newParty.getData()
        });
    }

}