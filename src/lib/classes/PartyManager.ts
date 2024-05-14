import Party from "../components/party/Party";
import crypto from "crypto";
import User from "../components/user/User";

export default class PartyManager {

    static parties: Record<string, Party> = {};

    static async generate(owner: User) {
        let party = new Party();
        party.setOwnerID(owner.getID());
        party.users = [owner.getID()];
        this.register(party);
        return party.id;
    }

    static generateID() {
        return crypto.randomUUID();
    }

    static register(party: Party) {
        this.parties[party.id] = party;
    }

    static disband(party: Party) {
        delete this.parties[party.id];
    }

    static get(id: string){
        return this.parties[id];
    }

}