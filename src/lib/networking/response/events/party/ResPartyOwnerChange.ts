import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";
import User from "../../../../components/user/User";

export default class ResPartyOwnerChange extends Message {
    constructor(owner: User, newParty: Party) {
        super("party.owner", {
            owner: owner.getID(),
            party: newParty.getData()
        });
    }

}