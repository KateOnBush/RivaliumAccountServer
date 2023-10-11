import {WebSocket} from "ws";
import User from "./User";
import {UserSessionTimeout} from "../../../env.var";
import Logger from "../../tools/Logger";
import Message from "../../types/Message";

export default class UserSession {

    socket: WebSocket;
    authorized: boolean = false;
    authenticated: boolean = false;
    user: User | null = null;
    heartbeatTimeout: NodeJS.Timeout | null;

    constructor(socket: WebSocket){
        this.socket = socket;
    }

    hasUser(){
        return !!this.user;
    }

    awaitHeartbeat() {

        this.clearHeartbeat();

        this.heartbeatTimeout = setTimeout(() => {
            this.socket.close();
            this.user?.disconnect();
            Logger.error('User {} timed out, disconnecting...', this.user?.username ?? "N/A");
        }, UserSessionTimeout);

    }

    clearHeartbeat() {
        if (this.heartbeatTimeout) clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = null;
    }

    send(message: Message) {
        this.socket.send(message.bake());
    }

}