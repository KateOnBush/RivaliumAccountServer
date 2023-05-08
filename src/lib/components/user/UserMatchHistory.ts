import Database from "../../Database";
import Match from "../match/Match";

export default class UserMatchHistory {

    matchList: string[] = [];

    async getMatch(id: string) {

        if (this.matchList.includes(id)) return await Database.fetchMatch(id);

    }

    async addMatch(match: Match){

        this.matchList.push(match.id.toString());

    }

    async getMatches(n: number){

        let res = [];
        for(var l = 0; l < n; l++){
            res.push(await Database.fetchMatch(this.matchList[l]));
        }
        return res;

    }

}