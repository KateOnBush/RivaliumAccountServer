import {WebSocket} from "ws";
import User from "./User";

export default class UserSession {

    socket: WebSocket;
    authorized: boolean = false;
    authenticated: boolean = false;
    user: User | null = null;

    constructor(socket: WebSocket){
        this.socket = socket;
    }

    hasUser(){
        return !!this.user;
    }

}