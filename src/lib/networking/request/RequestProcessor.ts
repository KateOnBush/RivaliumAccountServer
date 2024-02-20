import UserSession from "../../components/user/UserSession";
import Logger from "../../tools/Logger";
import IMessage from "../../interfaces/IMessage";
import RequestEvent from "./RequestEvent";
import {readdirSync, statSync} from 'fs';
import {join, resolve} from 'path';
import Message from "../../types/Message";
import Time from "../../tools/Time";

export default class RequestProcessor {

    static eventMap = new Map<string, RequestEvent>();

    static async registerClasses(directory: string) {
        const files = readdirSync(directory);

        Logger.info("Fetching directory...", directory);
        await Time.wait(50);
        for (const file of files) {
            const filePath = join(directory, file);
            const fileStats = statSync(filePath);

            if (fileStats.isDirectory()) {
                Logger.info("Reading directory {}...", file);
                await this.registerClasses(filePath);
                Logger.clearLine();
            } else if (fileStats.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
                const eventModule = require(resolve(filePath));
                for (const key of Object.keys(eventModule)) {
                    const eventClass = eventModule[key];
                    if (eventClass.prototype instanceof RequestEvent) {
                        let instanceClass = new eventClass();
                        Logger.clearLine();
                        Logger.log("Registering event {}", instanceClass.event);
                        this.registerEvent(instanceClass.event, instanceClass);
                    }
                }
            }
        }
        Logger.clearLine();
    }

    static registerEvent(event: string, eventClass: RequestEvent) {
        this.eventMap.set(event, eventClass);
    }

    static async process(session: UserSession, jsonMessage: string): Promise<Message | null>{

        let data;
        try {
            data = JSON.parse(jsonMessage) as IMessage;
        } catch(err){
            Logger.error("Error parsing message received from user {}, content: {}", session.user?.username ?? "N/A", jsonMessage);
            return null;
        }

        let event = data.event, content = data.content;

        if (event != 'client.heartbeat')
            Logger.info("Received message from user {} with event: {}", session.user?.username ?? "N/A", data.event);

        if (this.eventMap.size == 0) Logger.fatal("Event map size is empty");

        let requestEvent = this.eventMap.get(event);
        if (!requestEvent) {
            Logger.warn("Unrecognized event name: {}", event);
            return null;
        }

        try {
            return await requestEvent.process(content, session);
        } catch (e) {
            Logger.error("Unexpected error occurred while handling {}'s message\nevent: {}\ncontent: {}\nreason: {}", session.user?.username ?? "N/A", event, JSON.stringify(content), e);
            return null;
        }

    }

}