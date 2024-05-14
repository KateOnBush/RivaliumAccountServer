import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import ResUpdateUserSelf from "../../../response/events/update/ResUpdateUserSelf";

export default class ReqPartyLeaveQueue extends RequestEvent {

    event = "party.leave.queue";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        let user = session.user, party = user.getParty();
        if (party.getOwnerID() != user.getID()) return new ServerResponseError(this.event, "not.owner");
        if (!party.inQueue) return new ServerResponseError(this.event, "not.in.queue");

        await party.leaveQueue();

        (await party.getUsers()).forEach(user => {
            user.send(new ResUpdateUserSelf(user));
        });

        return new ServerResponseOk(this.event);

    }

}