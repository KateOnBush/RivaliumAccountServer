import {id, ignore} from 'mongodb-typescript'
import UserMatchHistory from "./UserMatchHistory";
import {ObjectId} from 'mongodb';
import UserInventory from './UserInventory';
import UserFriendManager from './UserFriendManager';
import Database from '../../classes/Database';
import UserSession from "./UserSession";
import PartyManager from "../../classes/PartyManager";
import Message from "../../types/Message";
import UserSkill from "./UserSkill";
import UserRank from "./UserRank";
import UserWardrobe from "./UserWardrobe";
import UserCurrency from "./UserCurrency";
import Logger from "../../tools/Logger";

export default class User {

    @id
    id: ObjectId;
    username: string;
    password: string;
    email: string;
    createdAt: number = Date.now();

    @ignore
    session: UserSession;

    @ignore
    party: string = "";

    //@nested(()=>UserMatchHistory)
    matchHistory: UserMatchHistory = new UserMatchHistory();
    inventory: UserInventory = new UserInventory();
    friendManager: UserFriendManager = new UserFriendManager();
    wardrobe: UserWardrobe = new UserWardrobe();
    skill: UserSkill = new UserSkill();
    rank: UserRank = new UserRank();
    currency: UserCurrency = new UserCurrency();

    @ignore
    connected: boolean;

    inGame: boolean;
    currentGameId: string;

    async save(){
        await Database.saveUser(this);
    }

    async connect(){
        this.connected = true;
        this.party = await PartyManager.generate(this);
        await this.save();
    }

    async disconnect(){
        if (!this.connected) return;
        this.connected = false;
        await this.getParty().removeUser(this);
        this.session?.clearHeartbeat();
        await this.save();
    }

    getID(){
        return this.id.toString();
    }

    getParty() {
        return PartyManager.get(this.party);
    }

    getLimitedData() {
        return {
            id: this.getID(),
            username: this.username,
            skill: this.skill,
            rank: this.rank,
            wardrobe: this.wardrobe,
            party: this.party
        }
    }

    getData() {
        return {
            id: this.getID(),
            username: this.username,
            email: this.email,
            matchHistory: this.matchHistory,
            inventory: this.inventory,
            friendManager: this.friendManager,
            skill: this.skill,
            rank: this.rank,
            wardrobe: this.wardrobe,
            party: this.getParty().getData(),
            currency: this.currency
        }
    }

    async send(message: Message){
        Logger.success("Sending event {} with content {} to user {}", message.event, JSON.stringify(message.content), this.username);
        this.session?.send(message);
    }

}