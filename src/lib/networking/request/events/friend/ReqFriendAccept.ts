import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Authenticator from "../../../../classes/Authenticator";
import Database from "../../../../classes/Database";

export default class ReqFriendAdd extends RequestEvent {

    event = "friend.accept";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;
        if (!session.user) return null;

        const thisUser = session.user,
              thisUserID = thisUser.getID();

        if (thisUser.friendManager.friendList.includes(thisUserID)) return new ServerResponseError(this.event, "already.friends");

        const friendToAcceptID = content.friend;
        if (!friendToAcceptID) return new ServerResponseError(this.event, "no.user");

        const friendToAccept = await Database.fetchUser(friendToAcceptID);
        if (!friendToAccept) return new ServerResponseError(this.event, "no.user");

        if (
            !friendToAccept.friendManager.sentFriendRequests.includes(thisUserID) ||
            !thisUser.friendManager.receivedFriendRequests.includes(friendToAcceptID)
        ) {
            return new ServerResponseError(this.event, "no.request");
        } else {
            if (!friendToAccept.friendManager.friendList.includes(thisUserID)) friendToAccept.friendManager.friendList.push(thisUserID);
            if (!thisUser.friendManager.friendList.includes(friendToAcceptID)) thisUser.friendManager.friendList.push(friendToAcceptID);
        }

        await thisUser.save();
        await friendToAccept.save();

        return new ServerResponseOk(this.event);

    }

}