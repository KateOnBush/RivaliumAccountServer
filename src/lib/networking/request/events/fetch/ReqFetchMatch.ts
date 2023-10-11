import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import Database from "../../../../classes/Database";
import ServerResponseError from "../../../response/ServerResponseError";

export default class ReqFetchMatch extends RequestEvent {

    event = "fetch.match";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        let fetchID = content.id;
        let fetchedMatch = await Database.fetchMatch(fetchID);

        if (!fetchedMatch) return new ServerResponseError(this.event, "incorrect.id");

        return new ServerResponseOk(this.event, fetchedMatch);

    }

}