import bcrypt from 'bcryptjs'
import Match from './components/match/Match';
import User from './components/User';

import { passwordSaltRounds, 
    usernameRegex, 
    passwordRegex, 
    usernameRequirementMessage, 
    passwordRequirementMessage,
    databasePath 
} from '../env.var'

import { MongoClient, ObjectId } from 'mongodb';
import { Repository } from 'mongodb-typescript';

const uri = databasePath;
const DatabaseClient = new MongoClient(uri);
let UserRepository = new Repository<User>(User, DatabaseClient, "account", { databaseName: "epicgame" });
let MatchRepository = new Repository<Match>(Match, DatabaseClient, "match", { databaseName: "epicgame" });

export default class Database {

    static async fetchUser(id: string) {

        return await UserRepository.findById(new ObjectId(id));
        
    }

    static async fetchMatch(id: string){ 

        return await MatchRepository.findById(new ObjectId(id));
        
    }

    static async findUserId(name: string){

        const query = { username: name };
        return await UserRepository.findOne(query);

    }

    static async registerUser(name: string, password: string) {

        console.log(await this.findUserId(name) )

        if (await this.findUserId(name) != null) throw "Username already taken.";

        if (!name.match(usernameRegex)) throw usernameRequirementMessage;

        if (!password.match(passwordRegex)) throw passwordRequirementMessage;
        
        let createdUser = new User();
        createdUser.username = name;
        createdUser.password = await this.hashPassword(password);

        await UserRepository.insert(createdUser);

        return createdUser;

    }


    static async hashPassword(password: string){

        let salt = await bcrypt.genSalt(passwordSaltRounds);
    
        return await bcrypt.hash(password, salt);

    }

    static async checkPassword(password: string, hashed: string){

        return await bcrypt.compare(password, hashed);

    }

    static unexpectedErrorText(errorCode: string){

        return `An unexpected error occured. (${errorCode})`;
    }

    static async saveUser(user: User) {

        return await UserRepository.save(user);

    }

    static async saveMatch(match: Match) {

        return await MatchRepository.save(match);

    }

}