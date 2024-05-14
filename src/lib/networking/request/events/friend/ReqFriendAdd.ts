import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Database from "../../../../classes/Database";
import ResFriendAdd from "../../../response/events/friend/ResFriendAdd";

export default class ReqFriendAdd extends RequestEvent {

    event = "friend.add";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;
        if (!session.user) return null;

        const thisUser = session.user,
              thisUserID = thisUser.getID();

        if (thisUser.friendManager.friendList.includes(thisUserID)) return new ServerResponseError(this.event, "already.friends");

        const friendToAddID = content.friend;
        if (!friendToAddID) return new ServerResponseError(this.event, "no.user");

        const friendToAdd = await Database.fetchUser(friendToAddID);
        if (!friendToAdd) return new ServerResponseError(this.event, "no.user");

        if (
            friendToAdd.friendManager.receivedFriendRequests.includes(thisUserID) &&
            thisUser.friendManager.sentFriendRequests.includes(friendToAddID)
        ) {
            return new ServerResponseError(this.event, "already.sent");
        } else {
            if (!friendToAdd.friendManager.receivedFriendRequests.includes(thisUserID)) friendToAdd.friendManager.receivedFriendRequests.push(thisUserID);
            if (!thisUser.friendManager.sentFriendRequests.includes(friendToAddID)) thisUser.friendManager.sentFriendRequests.push(friendToAddID);
        }

        await thisUser.save();
        await friendToAdd.save();

        if (friendToAdd.connected) {
            await friendToAdd.send(new ResFriendAdd(thisUser));
        }

        return new ServerResponseOk(this.event);

    }

}