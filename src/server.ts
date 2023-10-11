import {serverPort} from "./env.var";
import {WebSocket, WebSocketServer} from "ws";
import UserSession from "./lib/components/user/UserSession";
import Logger from "./lib/tools/Logger";
import RequestProcessor from "./lib/networking/request/RequestProcessor";
import ServerResponse from "./lib/networking/response/ServerResponse";

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

    socket.session.awaitHeartbeat();

    socket.on("message", (bufferData: Buffer) => {

        socket.session.awaitHeartbeat();

        let jsonString = bufferData.toString('utf8');
        let messageList = jsonString.split("\0");
        messageList = messageList.filter(m => m.length > 1);

        messageList.forEach(async message => {
            let response = await RequestProcessor.process(socket.session, message);
            if (response && response instanceof ServerResponse) {
                if (response.reply != "client.heartbeat") Logger.success("Replying to event {} with status {} and content {}", response.reply, response.status, JSON.stringify(response.content));
                socket.send(response.bake());
            }
        });

    });

    socket.on('close', ()=>{
        Logger.log("Connection closing, attempting to disconnect user {}", socket.session?.user?.username ?? "N/A");
        socket.session?.user?.disconnect();
    })

    socket.on('error', ()=>{
        Logger.log("Error occurred, attempting to disconnect user {}", socket.session?.user?.username ?? "N/A");
        socket.session?.user?.disconnect();
    })

});


export default server;
