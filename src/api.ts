import express from 'express';
const api = express();
import { apiPort as PORT } from './env.var';

api.get("/", (req, res)=>{

    res.send("Hello there");

})

export default api;