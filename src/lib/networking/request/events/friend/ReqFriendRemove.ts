import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Authenticator from "../../../../classes/Authenticator";
import Database from "../../../../classes/Database";

export default class ReqFriendRemove extends RequestEvent {

    event = "friend.remove";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;
        if (!session.user) return null;

        const thisUser = session.user,
              thisUserID = thisUser.getID();

        if (!thisUser.friendManager.friendList.includes(thisUserID)) return new ServerResponseError(this.event, "not.friends");

        const friendToRemoveID = content.friend;
        if (!friendToRemoveID) return new ServerResponseError(this.event, "no.user");

        const friendToRemove = await Database.fetchUser(friendToRemoveID);
        if (!friendToRemove) return new ServerResponseError(this.event, "no.user");

        const friendToRemoveFriends = friendToRemove.friendManager.friendList;
        if (friendToRemoveFriends.includes(thisUserID)) {
            friendToRemove.friendManager.friendList = friendToRemoveFriends.filter(t => t != thisUserID);
        }

        const thisUserFriends = thisUser.friendManager.friendList;
        if (thisUserFriends.includes(friendToRemoveID)) {
            thisUser.friendManager.friendList = thisUserFriends.filter(t => t != friendToRemoveID);
        }

        await thisUser.save();
        await friendToRemove.save();

        return new ServerResponseOk(this.event);

    }

}