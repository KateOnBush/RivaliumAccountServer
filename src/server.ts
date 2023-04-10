import { serverPort } from "./env.var";
import Database from "./lib/Database";
import { WebSocketServer } from "ws";

const server = new WebSocketServer({
    port: serverPort
});

server.on('connection', (socket, request) => {

    //Identify

});

export default server;
