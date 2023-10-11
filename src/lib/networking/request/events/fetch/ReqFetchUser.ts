import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import Database from "../../../../classes/Database";
import ServerResponseError from "../../../response/ServerResponseError";
import ResUpdateUser from "../../../response/events/update/ResUpdateUser";

export default class ReqFetchUser extends RequestEvent {

    event = "fetch.user";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        let fetchID = content.id;
        let fetchedUser = await Database.fetchUser(fetchID);

        if (!fetchedUser) return new ServerResponseError(this.event, "incorrect.id");

        session.send(new ResUpdateUser(fetchedUser));

        return new ServerResponseOk(this.event);

    }

}