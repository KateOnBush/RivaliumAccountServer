import api from "./api";
import { apiPort } from "./env.var";
import server from "./server";

api.listen(apiPort, ()=>{

    console.log("API listening now.");

})

server.on('listening', ()=>{

    console.log("TCP Server listening now.");

})