import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";

export default class ReqClientHeartbeat extends RequestEvent {

    event = "client.heartbeat";

    async process(content: any, session: UserSession): Promise<Message | null> {

        return new ServerResponseOk(this.event);

    }

}