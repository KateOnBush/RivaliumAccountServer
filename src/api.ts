import express from 'express';
const api = express();
import { apiPort as PORT } from './env.var';
import Database from './lib/Database';

const userRoute = api.route("/api/:userId/get");

userRoute.get(async (req, res)=>{

    let user = await Database.fetchUser(req.params.userId);
    if (user) {
        res.send(user);
        return;
    }

    res.status(500).send("NIGGA WHAT");
    

})

api.get("/api/getall", async (req, res)=>{

    res.send(await Database.getAll());

})


export default api;