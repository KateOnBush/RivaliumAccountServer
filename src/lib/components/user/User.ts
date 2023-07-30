import {id, nested, ignore} from 'mongodb-typescript'
import UserMatchHistory from "./UserMatchHistory";
import { ObjectId } from 'mongodb';
import UserInventory from './UserInventory';
import UserFriendManager from './UserFriendManager';
import Database from '../../classes/Database';

export default class User {

    @id
    id: ObjectId;
    inGame: boolean;
    username: string;
    password: string;
    email: string;
    createdAt: number = Date.now();

    party?: string;

    //@nested(()=>UserMatchHistory)
    matchHistory: UserMatchHistory = new UserMatchHistory();

    //@nested(()=>UserInventory)
    inventory: UserInventory = new UserInventory();

    //@nested(()=>UserFriendManager)
    friendManager: UserFriendManager = new UserFriendManager();

    @ignore
    connected: boolean;

    async save(){
        await Database.saveUser(this);
    }

    async connect(){
        this.connected = true;
        await this.save();
    }

    async disconnect(){
        this.connected = false;
        await this.save();
    }

    getID(){
        return this.id.toString();
    }

    getData() {
        return {
            id: this.id.toString("hex"),
            username: this.username,
            email: this.email,
            matchHistory: this.matchHistory,
            inventory: this.inventory,
            friendManager: this.friendManager
        }
    }

}