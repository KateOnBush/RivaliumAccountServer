import bcrypt from 'bcryptjs'
import Match from '../components/match/Match';
import User from '../components/user/User';
import Logger from "../tools/Logger";

import {databasePath, passwordSaltRounds} from '../../env.var'

import {MongoClient, ObjectId} from 'mongodb';
import {Repository} from 'mongodb-typescript';
import Version from "../types/Version";
import {MatchType} from "../components/match/MatchTypes";


let DatabaseClient = new MongoClient(databasePath);
let UserRepository = new Repository<User>(User, DatabaseClient, "account", { databaseName: "epicgame" });
let MatchRepository = new Repository<Match>(Match, DatabaseClient, "match", { databaseName: "epicgame" });
let VersionRepository = new Repository<Version>(Version, DatabaseClient, "version", {databaseName: "epicgame"});


export class DatabaseCache {

    static users: User[] = [];
    static matches: Match[] = [];

}

export default class Database {

    static async getAll(){
        return await UserRepository.find({}).toArray();
    }

    static async fetchUser(id: string){

        let cached = DatabaseCache.users.find(u => u.getID() == id);
        if (cached) return cached;
        else {
            let fetched = await UserRepository.findById(new ObjectId(id));
            if (fetched) DatabaseCache.users.push(fetched);
            return fetched;
        }
        
    }

    static async fetchMatch(id: string){

        let cached = DatabaseCache.matches.find(m => m.getID() == id);
        if (cached) return cached;
        else {
            let fetched = await MatchRepository.findById(new ObjectId(id));
            if (fetched) DatabaseCache.matches.push(fetched);
            return fetched;
        }
        
    }

    static async findUserByName(name: string){

        let cached = DatabaseCache.users.find(u => u.username == name);
        if (cached) return cached;
        else {
            const query = { username: name };
            let fetched = await UserRepository.findOne(query);
            if (fetched) DatabaseCache.users.push(fetched);
            return fetched;
        }

    }

    static async findUserByMail(email: string) {

        let cached = DatabaseCache.users.find(u => u.email == email);
        if (cached) return cached;
        else {
            const query = { email };
            let fetched = await UserRepository.findOne(query);
            if (fetched) DatabaseCache.users.push(fetched);
            return fetched;
        }

    }

    static async registerUser(name: string, password: string, email: string) {
        
        let createdUser = new User();
        createdUser.username = name;
        createdUser.password = await this.hashPassword(password);

        DatabaseCache.users.push(createdUser);
        await UserRepository.insert(createdUser);

        return createdUser;

    }

    static async registerMatch(type: MatchType, teams: User[][]) {

        let match = new Match(type, teams);
        await MatchRepository.insert(match);
        return match;

    }

    static async hashPassword(password: string){

        let salt = await bcrypt.genSalt(passwordSaltRounds);
    
        return await bcrypt.hash(password, salt);

    }

    static async checkPassword(password: string, hashed: string){

        return await bcrypt.compare(password, hashed);

    }

    static unexpectedErrorText(errorCode: string){

        return `An unexpected error occurred. (${errorCode})`;
    }

    static async saveUser(user: User) {

        let cachedInd = DatabaseCache.users.findIndex(u => u.getID() == user.getID());
        if (cachedInd == -1) {
            DatabaseCache.users.push(user);
        } else {
            DatabaseCache.users[cachedInd] = user;
        }
        await UserRepository.save(user);

    }

    static async saveMatch(match: Match) {

        let cachedInd = DatabaseCache.matches.findIndex(m => m.getID() == match.getID());
        if (cachedInd == -1) {
            DatabaseCache.matches.push(match);
        } else {
            DatabaseCache.matches[cachedInd] = match;
        }
        await MatchRepository.save(match);

    }

    static async getVersion(){

        return await VersionRepository.findOne({});

    }

}