import Message from "../../../../types/Message";
import User from "../../../../components/user/User";

export default class ResPartyOwnerChange extends Message {
    constructor(owner: User) {
        super("party.owner", {
            owner: {id: owner.getID(), username: owner.username}
        });
    }

}