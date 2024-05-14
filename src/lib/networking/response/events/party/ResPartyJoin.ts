import Message from "../../../../types/Message";
import User from "../../../../components/user/User";

export default class ResPartyJoin extends Message {
    constructor(user: User) {
        super("party.join", {
            user: {id: user.getID(), username: user.username},
        });
    }

}