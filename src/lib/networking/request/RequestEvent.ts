import UserSession from "../../components/user/UserSession";
import Message from "../../types/Message";

export default abstract class RequestEvent {

    abstract event: string;

    abstract process(content: any, session: UserSession): Promise<Message | null>;

}
