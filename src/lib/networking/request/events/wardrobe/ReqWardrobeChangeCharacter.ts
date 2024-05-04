import RequestEvent from "../../RequestEvent";
import Message from "../../../../types/Message";
import UserSession from "../../../../components/user/UserSession";
import ServerResponseOk from "../../../response/ServerResponseOk";
import ServerResponseError from "../../../response/ServerResponseError";
import Matchmaker from "../../../../classes/Matchmaker";
import ResUpdateUserSelf from "../../../response/events/update/ResUpdateUserSelf";

export default class ReqWardrobeChangeCharacter extends RequestEvent {

    event = "wardrobe.change.char";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authenticated || !session.user) return null;

        let user = session.user, target = content.target;
        if (!user.inventory.characters.includes(target)) return new ServerResponseError(this.event, "unowned");

        user.wardrobe.selectedChar = target;
        await user.save();
        await user.send(new ResUpdateUserSelf(user));

        return new ServerResponseOk(this.event);

    }

}