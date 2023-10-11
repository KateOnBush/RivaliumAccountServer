import Party from "../components/party/Party";
import Logger from "./Logger";
import {DatabaseCache} from "../classes/Database";
import User from "../components/user/User";
import {ObjectId} from "mongodb";

const genRanHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export default class BetaTesting {

    static generateTestParty(size: number) {

        let party = new Party();
        party.users = [];
        for(let i = 0; i < size; i++){
            let newUser = new User();
            newUser.id = new ObjectId(genRanHex(24));
            newUser.skill.mmr = Math.floor(Math.random() * 4000);
            DatabaseCache.users.push(newUser);
            party.users.push(newUser.getID());
        }

        return party;

    }

    static generateDefaultTestParty() {

        let chance = Math.random(), size;
        if (chance > .5) size = 1;
        else if (chance > .25) size = 2;
        else if (chance > .1) size = 3;
        else size = 4;

        return this.generateTestParty(size);

    }

    static generateRandomTestParties(amount: number, maxSize: number) {

        let sizes = [];
        let parties = [];

        for(let i = 0; i < amount; i++){
            let size = Math.ceil(Math.random() * maxSize);
            sizes.push(size);
            parties.push(this.generateTestParty(size))
        }

        Logger.log("Generated {} parties with sizes: {}", amount, sizes);

        return parties;

    }

    static generateRandomDefaultParties(amount: number) {

        let sizes = [];
        let parties = [];

        for(let i = 0; i < amount; i++){
            let party = this.generateDefaultTestParty();
            sizes.push(party.size);
            parties.push(party);
        }

        Logger.log("Generated {} parties with sizes: {}", amount, sizes);

        return parties;

    }

}