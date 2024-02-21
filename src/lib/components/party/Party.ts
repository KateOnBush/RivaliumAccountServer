import User from '../user/User';
import Database from '../../classes/Database';
import PartyManager from "../../classes/PartyManager";
import ResUpdateParty from "../../networking/response/events/update/ResUpdateParty";
import Queue from "../queue/Queue";
import Logger from "../../tools/Logger";
import ResPartyDisconnect from "../../networking/response/events/party/ResPartyDisconnect";
import ResPartyJoin from "../../networking/response/events/party/ResPartyJoin";
import ResPartyJoinQueue from "../../networking/response/events/party/ResPartyJoinQueue";
import ResPartyLeaveQueue from "../../networking/response/events/party/ResPartyLeaveQueue";

export default class Party {

    id: string = PartyManager.generateID();

    users: string[] = [];
    owner: string;

    averageMMR: number = 0;
    weighedRR: number = 0;

    joinQueueTimeout: NodeJS.Timeout | null = null;
    joinedQueue: Queue | null = null;

    constructor() {
        PartyManager.register(this);
    }

    async getUsers(){

        let res: User[] = [];
        for(const uuid of this.users){

            let nUser = await Database.fetchUser(uuid);
            if (nUser) res.push(nUser);

        }

        return res;

    }

    getOwnerID() {
        return this.owner;
    }

    setOwnerID(id: string) {
        this.owner = id;
    }

    async updateRatingStats() {

        let users = (await this.getUsers());

        let MMRs = users.map<number>(user=> user.skill.mmr);
        let totalMMR = MMRs.reduce((acc, elem) => acc + elem, 0);
        this.averageMMR = totalMMR / this.size;

        let WeighedRRs = users.map(user => user.rank.rating * user.rank.tier);
        let totalWRRs = WeighedRRs.reduce((acc, elem) => acc + elem, 0);
        this.weighedRR = totalWRRs / this.size;

    }

    get size() {
        return this.users.length;
    }

    async getOwner(){

        return await Database.fetchUser(this.owner);

    }

    async hasUser(id: string) {
        return this.users.includes(id);
    }

    async getUser(id: string){

        if (this.users.includes(id)) return await Database.fetchUser(id);
        else return null;

    }


    async addUser(user: User) {

        if (!this.users.includes(user.getID())) {
            this.users.push(user.getID());
            const users = await this.getUsers();
            for(const otherUser of users) {
                await otherUser.send(new ResPartyJoin(user, this));
            }
        }

    }

    async removeUser(user: User){

        if (!this.users.includes(user.getID())) return;
        this.users = this.users.filter(t=> t!=user.getID());
        if (this.getOwnerID() == user.getID()) {
            if (this.users.length == 0) {
                PartyManager.disband(this);
            }
            else this.setOwnerID(this.users[0]);
        }

        let users = await this.getUsers();
        for(const otherUser of users) {
            await otherUser.send(new ResPartyDisconnect(user, this));
        }

        if (this.inQueue) await this.leaveQueue();

    }

    async update() {

        let users = await this.getUsers();
        for(let user of users){
            await user.send(new ResUpdateParty(this));
        }

    }

    getData() {
        return {
            id: this.id,
            users: this.users,
            owner: this.owner,
            inQueue: this.inQueue,
        };
    }

    private clearJoinQueueTimeout() {
        if (this.joinQueueTimeout) clearTimeout(this.joinQueueTimeout);
        this.joinQueueTimeout = null;
    }

    get inQueue() {
        return this.joinedQueue != null;
    }

    async joinQueue(queue: Queue) {
        this.clearJoinQueueTimeout();
        this.joinedQueue = queue;
        const users = await this.getUsers();
        for(const user of users) {
            await user.send(new ResPartyJoinQueue(queue.name));
        }
        this.joinQueueTimeout = setTimeout(async () => {
            let owner = await this.getOwner();
            if (owner) {
                Logger.info("Party with owner {} joining queue {}", owner.username, queue.name);
            }
            queue.queue(this);
        }, 10 * 1000); //10 * 1000
    }

    async leaveQueue() {
        const users = await this.getUsers();
        for(const user of users) {
            await user.send(new ResPartyLeaveQueue());
        }
        this.clearJoinQueueTimeout();
        this.joinedQueue?.leave(this);
        this.joinedQueue = null;
    }

}