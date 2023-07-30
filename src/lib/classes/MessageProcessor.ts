import UserSession from "../components/user/UserSession";
import Logger from "../tools/Logger";
import IClientMessage from "../interfaces/IClientMessage";
import Database from "./Database";
import IVersion from "../interfaces/IVersion";
import ServerResponse from "../networking/ServerResponse";
import ServerResponseInternalError from "../networking/response/ServerResponseInternalError";
import Version from "../types/Version";
import ServerResponseOk from "../networking/response/ServerResponseOk";
import ServerResponseError from "../networking/response/ServerResponseError";
import {emailRegex} from "../../env.var";
import bcrypt from "bcryptjs";

export default class MessageProcessor {

    static async process(session: UserSession, jsonMessage: string): Promise<ServerResponse | null>{

        let data;
        try {
            data = JSON.parse(jsonMessage) as IClientMessage;
            Logger.info("Received message from user {} with event: {}", session.user?.username ?? "UNIDENTIFIED", data.event);
        } catch(err){
            Logger.error("Error handling message received from user {}, content: {}", session.user?.username ?? "UNIDENTIFIED", jsonMessage);
            return null;
        }

        let event = data.event, content = data.content;

        switch(event) {

            case "client.version": {

                if (session.authorized) return null;

                let clientVersion = content.version as IVersion;
                let serverVersion = await Database.getVersion();

                if (!serverVersion) {
                    Logger.fatal("Client is attempting to check for updates but no version is available on database.");
                    return new ServerResponseInternalError(event, "Cannot check for updates for the moment. Please try again later.", true);
                }

                let versionIsCorrect = Version.compare(clientVersion, serverVersion);
                if (versionIsCorrect) {
                    session.authorized = true;
                    return new ServerResponseOk(event);
                } else {
                    return new ServerResponseError(event, "version.outdated");
                }

            }

            case "client.login": {

                if (!session.authorized) {
                    Logger.error("Unauthorized client attempting to login.");
                    return new ServerResponseError(event, "unauthorized");
                }

                if (session.authenticated) {
                    Logger.error("Client already logged in.");
                    return new ServerResponseError(event, "already.logged");
                }

                let access = content.access, password = content.password;
                let isEmail = emailRegex.test(access);

                let fetchedUser = await (isEmail ? Database.findUserByMail(access) : Database.findUserByName(access));
                if (!fetchedUser) return new ServerResponseError(event, "username.incorrect");

                let correctPassword = await bcrypt.compare(password, fetchedUser.password);
                if (!correctPassword) return new ServerResponseOk(event, "password.incorrect");

                session.authenticated = true;

                //Access token
                let accessToken = "nigger";

                return new ServerResponseOk(event, {
                    accessToken,
                    user: fetchedUser.getData()
                });

            }

        }

        return null;

    }

}