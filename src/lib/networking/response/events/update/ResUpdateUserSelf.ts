import Message from "../../../../types/Message";
import User from "../../../../components/user/User";

export default class ResUpdateUserSelf extends Message {

    constructor(user: User) {
        super("update.self", user.getData());
    }

}