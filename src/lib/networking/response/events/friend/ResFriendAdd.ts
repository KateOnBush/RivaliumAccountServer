import Message from "../../../../types/Message";
import User from "../../../../components/user/User";

export default class ResFriendAdd extends Message {
    constructor(adder: User) {
        super("friend.add", {
            user: adder.getLimitedData(),
        });
    }

}