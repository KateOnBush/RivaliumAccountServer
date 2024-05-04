import Authenticator from "./lib/classes/Authenticator";


let beginTime = performance.now();

import Logger from "./lib/tools/Logger";
import api from "./api";
import {apiPort, LOGO, serverPort} from "./env.var";
import server from "./server";
import {WebSocket} from "ws";
import Matchmaker from "./lib/classes/Matchmaker";
import RequestProcessor from "./lib/networking/request/RequestProcessor";
import Time from "./lib/tools/Time";
import * as path from "path";

api.listen(apiPort, ()=>{

});

server.on("listening", async (socket: WebSocket) => {

    const startTime = performance.now() - beginTime;
    Logger.clear();
    Logger.important("Registering request events...");
    Logger.important(__filename);
    await RequestProcessor.registerClasses(path.dirname(__filename) + "/lib/networking/request/events");
    Logger.clearLine();
    Logger.info("Account server starting...");
    await Time.wait(1000);
    Logger.clear();
    Logger.important(LOGO);
    Logger.success("Account server started successfully.");
    Logger.info("Server running on port: {}", serverPort);
    Logger.info("Server took {}ms to start", Math.round(startTime));

    setInterval(() => Matchmaker.processQueues(), 150);

})