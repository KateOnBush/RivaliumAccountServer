import Message from "../../../../types/Message";
import User from "../../../../components/user/User";

export default class ResUpdateUser extends Message {

    constructor(user: User) {
        super("update.user", user.getLimitedData());

    }

}