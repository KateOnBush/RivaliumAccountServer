import { serverPort } from "./env.var";
import {RawData, WebSocket, WebSocketServer} from "ws";
import UserSession from "./lib/components/user/UserSession";
import Logger from "./lib/tools/Logger";
import MessageProcessor from "./lib/classes/MessageProcessor";

const server = new WebSocketServer({
    port: serverPort
});

interface UserSocket extends WebSocket {
    session: UserSession;
}


server.on('connection', (socket: UserSocket, request) => {

    socket.session = new UserSession(socket);
    let IP = request.socket.remoteAddress;
    Logger.info("New user connected... IP: {}, Awaiting authentication...", IP ?? "UNKNOWN_IP");

    socket.on("message", (bufferData: Buffer) => {

        let jsonString = bufferData.toString('utf8');
        let messageList = jsonString.split("\0");
        messageList = messageList.filter(m => m.length > 1);

        messageList.forEach(async message => {
            let response = await MessageProcessor.process(socket.session, message);
            if (response) socket.send(response.bake());
        });

    });



});

export default server;
