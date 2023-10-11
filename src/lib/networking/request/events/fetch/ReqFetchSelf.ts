import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ResUpdateUserSelf from "../../../response/events/update/ResUpdateUserSelf";

export default class ReqFetchSelf extends RequestEvent {

    event = "fetch.self";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        session.send(new ResUpdateUserSelf(session.user));

        return new ServerResponseOk(this.event);

    }

}