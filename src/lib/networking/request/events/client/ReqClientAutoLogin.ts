import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Authenticator from "../../../../classes/Authenticator";

export default class ReqClientAutoLogin extends RequestEvent {

    event = "client.autologin";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;

        if (!content["token"]) return new ServerResponseError(this.event);

        let user = await Authenticator.verifyAutologinToken(content.token);
        if (!user) return new ServerResponseError(this.event);
        if (user.connected) return new ServerResponseError(this.event, "already.logged");

        session.user = user;
        session.authenticated = true;
        session.user.connected = true;
        user.session = session;
        await user.connect();

        return new ServerResponseOk(this.event);

    }

}