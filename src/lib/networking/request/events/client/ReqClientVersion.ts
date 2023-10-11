import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import Logger from "../../../../tools/Logger";
import ServerResponseError from "../../../response/ServerResponseError";
import Database from "../../../../classes/Database";
import ServerResponseOk from "../../../response/ServerResponseOk";
import IVersion from "../../../../interfaces/IVersion";
import ServerResponseInternalError from "../../../response/ServerResponseInternalError";
import Version from "../../../../types/Version";

export default class ReqClientVersion extends RequestEvent {

    event = "client.version";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (session.authorized) return null;

        let clientVersion = content.version as IVersion;
        let serverVersion = await Database.getVersion();

        if (!serverVersion) {
            Logger.fatal("Client is attempting to check for updates but no version is available on database.");
            return new ServerResponseInternalError(this.event, "Cannot check for updates for the moment. Please try again later.", true);
        }

        let versionIsCorrect = Version.compare(clientVersion, serverVersion);
        if (versionIsCorrect) {
            session.authorized = true;
            return new ServerResponseOk(this.event);
        } else {
            return new ServerResponseError(this.event, "version.outdated");
        }

    }

}