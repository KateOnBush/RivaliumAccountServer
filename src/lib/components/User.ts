import {id, nested, ignore} from 'mongodb-typescript'
import UserMatchHistory from "./UserMatchHistory";
import { ObjectId } from 'mongodb';
import UserInventory from './UserInventory';
import UserFriendManager from './UserFriendManager';
import Database from '../Database';

export default class User {

    @id
    id: ObjectId;
    inGame: boolean;
    username: string;
    password: string;
    createdAt: number = Date.now();

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

    connect(){
        this.connected = true;
    }

    disconnect(){
        this.connected = false;
    }

}