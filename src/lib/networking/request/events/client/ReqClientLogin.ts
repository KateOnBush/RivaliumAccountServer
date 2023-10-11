import RequestEvent from "../../RequestEvent";
import UserSession from "../../../../components/user/UserSession";
import Message from "../../../../types/Message";
import Logger from "../../../../tools/Logger";
import ServerResponseError from "../../../response/ServerResponseError";
import {emailRegex} from "../../../../../env.var";
import Database from "../../../../classes/Database";
import bcrypt from "bcryptjs";
import ServerResponseOk from "../../../response/ServerResponseOk";
import Authenticator from "../../../../classes/Authenticator";

export default class ReqClientLogin extends RequestEvent {

    event = "client.login";

    async process(content: any, session: UserSession): Promise<Message | null> {

        if (!session.authorized) {
            Logger.error("Unauthorized client attempting to login.");
            return new ServerResponseError(this.event, "unauthorized");
        }

        if (session.authenticated) {
            Logger.error("Client already logged in.");
            return new ServerResponseError(this.event, "already.logged");
        }

        let access = content.access, password = content.password;
        let isEmail = emailRegex.test(access);
        let requestingAutoLogin = content.autologin;

        let fetchedUser = await (isEmail ? Database.findUserByMail(access) : Database.findUserByName(access));
        if (!fetchedUser) return new ServerResponseError(this.event, "access.incorrect");

        let correctPassword = await bcrypt.compare(password, fetchedUser.password);
        if (!correctPassword) return new ServerResponseError(this.event, "password.incorrect");

        if (fetchedUser.connected) return new ServerResponseError(this.event, "already.logged");

        session.authenticated = true;
        session.user = fetchedUser;
        session.user.connected = true;
        fetchedUser.session = session;
        await fetchedUser.connect();

        //Access token
        let accessToken = await Authenticator.generateAccessToken(fetchedUser);
        let replyContent: Record<any, any> = {
            accessToken
        };
        if (requestingAutoLogin) replyContent.autologinToken = await Authenticator.generateAutologinToken(fetchedUser);

        return new ServerResponseOk(this.event, replyContent);

    }

}