import express from 'express';
import {apiPath} from './env.var';
import Database from './lib/classes/Database';
import cors from 'cors';

const api = express();

const userApiPath = apiPath + "/:userId";

api.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
  }));

api.get(userApiPath + "/get", async (req, res)=>{

    let user = await Database.fetchUser(req.params.userId);
    if (user) {
        res.send(user);
        return;
    }

    res.status(404).send({
        "error": "user_not_found"
    });
    

})

api.get(apiPath + "/getAll", async (req, res)=>{

    res.send(await Database.getAll());

});

export default api;