import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import {emailRegex, passwordRegex, usernameRegex} from "../../../../../env.var";
import ServerResponseError from "../../../response/ServerResponseError";
import Database from "../../../../classes/Database";
import ServerResponseOk from "../../../response/ServerResponseOk";

export default class ReqClientSignup extends RequestEvent {

    event: string = "client.signup";

    async process(content: any, session: UserSession): Promise<Message | null> {

        const email = content.email,
              username = content.username,
              password = content.password,
              passwordConfirm = content.passwordConfirm,
              acceptedTOS = content.acceptedTOS;

        if (!emailRegex.test(email)) return new ServerResponseError(this.event, "bad.email");
        if (!usernameRegex.test(username)) return new ServerResponseError(this.event, "bad.username");
        if (!passwordRegex.test(password)) return new ServerResponseError(this.event, "bad.password");
        if (password !== passwordConfirm) return new ServerResponseError(this.event, "bad.confirm");
        if (!acceptedTOS) return new ServerResponseError("bad.accept");

        let existingUsernameUser = await Database.findUserByName(username);
        if (existingUsernameUser != null) return new ServerResponseError(this.event, "username.taken");

        await Database.registerUser(username, password, email);

        return new ServerResponseOk(this.event);

    }

}