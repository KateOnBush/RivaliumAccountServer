import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Database from "../../../../classes/Database";

export default class ReqFriendDecline extends RequestEvent {

    event = "friend.decline";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;
        if (!session.user) return null;

        const thisUser = session.user,
              thisUserID = thisUser.getID();

        if (thisUser.friendManager.friendList.includes(thisUserID)) return new ServerResponseError(this.event, "already.friends");

        const friendToDeclineID = content.friend;
        if (!friendToDeclineID) return new ServerResponseError(this.event, "no.user");

        const friendToDecline = await Database.fetchUser(friendToDeclineID);
        if (!friendToDecline) return new ServerResponseError(this.event, "no.user");

        if (
            !friendToDecline.friendManager.sentFriendRequests.includes(thisUserID) ||
            !thisUser.friendManager.receivedFriendRequests.includes(friendToDeclineID)
        ) {
            return new ServerResponseError(this.event, "no.request");
        } else {
            friendToDecline.friendManager.sentFriendRequests = friendToDecline.friendManager.sentFriendRequests.filter(request => request != thisUserID);
            thisUser.friendManager.receivedFriendRequests = thisUser.friendManager.receivedFriendRequests.filter(request => request != friendToDeclineID);
        }

        await thisUser.save();
        await friendToDecline.save();

        return new ServerResponseOk(this.event);

    }

}