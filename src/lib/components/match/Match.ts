import {id} from 'mongodb-typescript';
import MatchPlayerManager from './MatchPlayerManager';
import {ObjectId} from 'mongodb';
import {MatchState, MatchType} from "./MatchTypes";
import User from "../user/User";
import MatchPlayer from "./data/MatchPlayer";
import Database from "../../classes/Database";

class Match {

    @id
    id: ObjectId;
    type: MatchType = MatchType.CASUAL;
    state: MatchState = MatchState.AWAITING_INITIATION;
    playerManager: MatchPlayerManager = new MatchPlayerManager();
    pass: number;
    createdAt: number = Date.now();
    endedAt: number = Date.now();

    constructor(type: MatchType, teams: User[][]) {
        this.type = type;
        this.playerManager.players = teams.map(team => team.map(user => new MatchPlayer(user.getID())));
        this.pass = Math.floor(Math.random() * 0xFFFF_FFFF);
    }

    getID() {
        return this.id.toString();
    }

    async save() {
        await Database.saveMatch(this);
    }

    getPreMatchData() {

        return {
            id: this.getID(),
            type: this.type,
            state: this.state,
            players: this.playerManager.players,
            pass: this.pass
        }

    }

}

export default Match;