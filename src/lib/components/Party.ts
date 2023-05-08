import User from './user/User';
import { ObjectId } from 'mongodb';
import {id, nested, ignore} from 'mongodb-typescript'
import Database from '../Database';

export default class Party {

    @id
    id: ObjectId;

    users: string[] = [];
    owner: string;

    async getUsers(){

        let res: User[] = [];
        for(const uuid of this.users){

            let nUser = await Database.fetchUser(uuid);
            if (nUser) res.push(nUser);

        }

        return res;

    }

    async getOwner(){

        await Database.fetchUser(this.owner);

    }

    async getUser(id: string){

        if (this.users.includes(id)) return await Database.fetchUser(id);

    }

    async disband(){

        (await this.getUsers()).forEach(async t=>{
            t.party = undefined;
            await Database.saveUser(t);
        });

    }

    addUser(user: User){

        this.users.push(user.getID());

    }

    removeUser(user: User){

        this.users = this.users.filter(t=>t!=user.getID());

    }

}