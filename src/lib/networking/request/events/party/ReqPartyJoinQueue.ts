import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Matchmaker from "../../../../classes/Matchmaker";
import ResUpdateUserSelf from "../../../response/events/update/ResUpdateUserSelf";

export default class ReqPartyJoinQueue extends RequestEvent {

    event = "party.join.queue";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        let user = session.user, party = user.getParty();
        if (party.getOwnerID() != user.getID()) return new ServerResponseError(this.event, "not.owner");
        if (party.inQueue) return new ServerResponseError(this.event, "already.in.queue");

        if (content.queue == "casual") await party.joinQueue(Matchmaker.casualQueue);
        else if (content.queue == "ranked") {
            return new ServerResponseError(this.event, "no");
        }

        (await party.getUsers()).forEach(user => {
            user.send(new ResUpdateUserSelf(user));
        });

        return new ServerResponseOk(this.event);

    }

}