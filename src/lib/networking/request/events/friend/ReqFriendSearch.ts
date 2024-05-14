import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import ServerResponseOk from "../../../response/ServerResponseOk";
import Database from "../../../../classes/Database";

export default class ReqFriendSearch extends RequestEvent {

    event = "friend.search";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) return null;
        if (!session.user) return null;

        const thisUser = session.user,
              thisUserID = thisUser.getID();

        const searchQuery = content.query;

        const result = await Database.searchForUser(searchQuery);

        return new ServerResponseOk(this.event, result
                .filter(user => !thisUser.friendManager.friendList.includes(user.getID()) && thisUserID != user.getID())
                .map(user => {
            return {id: user.id, username: user.username}
        }));

    }

}