import api from "./api";
import {apiPort, serverPort} from "./env.var";
import server from "./server";
import {WebSocket} from "ws";
import Logger from "./lib/tools/Logger";

const beginTime = Date.now();

api.listen(apiPort, ()=>{

    console.log("API listening now.");

})

server.on("listening", (socket: WebSocket) => {

    console.log("\n" +
        "░█████╗░░█████╗░░█████╗░░█████╗░██╗░░░██╗███╗░░██╗████████╗  ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░\n" +
        "██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║░░░██║████╗░██║╚══██╔══╝  ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗\n" +
        "███████║██║░░╚═╝██║░░╚═╝██║░░██║██║░░░██║██╔██╗██║░░░██║░░░  ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝\n" +
        "██╔══██║██║░░██╗██║░░██╗██║░░██║██║░░░██║██║╚████║░░░██║░░░  ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗\n" +
        "██║░░██║╚█████╔╝╚█████╔╝╚█████╔╝╚██████╔╝██║░╚███║░░░██║░░░  ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║\n" +
        "╚═╝░░╚═╝░╚════╝░░╚════╝░░╚════╝░░╚═════╝░╚═╝░░╚══╝░░░╚═╝░░░  ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝");
    Logger.success("Account server started successfully.");
    Logger.info("Server running on port: {}", serverPort);
    Logger.info("Server took {}ms to start", Date.now() - beginTime);

})