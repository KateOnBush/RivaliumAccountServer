import Party from "../components/party/Party";
import Queue from "../components/queue/Queue";
import Logger from "../tools/Logger";
import PartyManager from "./PartyManager";
import {MatchType} from "../components/match/MatchTypes";
import User from "../components/user/User";
import Database from "./Database";
import ResQueueMatchFound from "../networking/response/events/queue/ResQueueMatchFound";

export default class Matchmaker {

    static casualQueue: Queue = new Queue("casual", 2, 2);
    static rankedQueue: Queue = new Queue("ranked");

    static queueCasual(party: Party) {
        this.casualQueue.queue(party);
    }

    static queueRanked(party: Party) {
        this.rankedQueue.queue(party);
    }

    static async processQueues() {

        await this.casualQueue.updateStats();
        await this.rankedQueue.updateStats();

        this.casualQueue.sort((a, b) => a.averageMMR - b.averageMMR);
        this.rankedQueue.sort((a, b) => a.weighedRR - b.weighedRR);

        let foundCasual = this.casualQueue.selectorStep();

        if (foundCasual) {

            let foundCasualParties = foundCasual.map(partyTeam => partyTeam.map(partyID => PartyManager.get(partyID)));

            const MMRRedFunc = (acc: number, p: string) => {
                let party = PartyManager.get(p);
                return acc + party.averageMMR * party.size;
            }
            let mmr1 = foundCasual[0].reduce(MMRRedFunc, 0) / 4;
            let mmr2 = foundCasual[1]?.reduce(MMRRedFunc, 0) / 4;

            Logger.success("Found match! Teams: {}", foundCasual.map(team => team.map(pid => PartyManager.get(pid).size)).join(" | "));
            Logger.info("MMRs: {} vs. {}", mmr1, mmr2);
            Logger.info("Queue size: {}, Sizes: {}", this.casualQueue.parties.length, this.casualQueue.parties.map(pid=>PartyManager.get(pid).size).toString());

            let createdMatch = await this.startNewMatch(MatchType.CASUAL, foundCasualParties);

            if (Queue.debugMode) {
                Logger.success("Created new match with id: {}", createdMatch.getID());
            }

        }

        this.rankedQueue.selectorStep();

    }

    static async startNewMatch(type: MatchType, teamedParties: Party[][]) {

        let teams: User[][] = [];
        for(const teamParty of teamedParties) {
            let currentTeam: User[] = [];
            for(const party of teamParty) {
                let users = await party.getUsers();
                currentTeam.push(...users);
            }
            teams.push(currentTeam);
        }

        let match = await Database.registerMatch(type, teams);
        const ids: number[] = [];


        for(const team of match.playerManager.players){
            for(const matchPlayer of team) {
                let user = await Database.fetchUser(matchPlayer.userId);
                if (!user) continue;
                matchPlayer.playerId = Math.floor(Math.random() * 10000);
                while(ids.includes(matchPlayer.playerId)) {
                    matchPlayer.playerId = Math.floor(Math.random() * 10000);
                }
                ids.push(matchPlayer.playerId);
                matchPlayer.charId = user.wardrobe.selectedChar;
                await user.send(new ResQueueMatchFound(match, matchPlayer.access, true));
                user.inGame = true;
                user.currentGameId = match.getID();
                await user.save();
            }
        }

        await match.save();

        return match;

    }

}