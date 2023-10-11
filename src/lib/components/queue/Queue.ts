import Party from "../party/Party";
import QueueSelector from "./QueueSelector";
import PartyManager from "../../classes/PartyManager";
import Logger from "../../tools/Logger";

export default class Queue {

    static debugMode = false;

    name: string;
    queuePlayers: number;
    teamCount: number;

    parties: string[] = [];
    selector: QueueSelector = new QueueSelector();

    private selectionTries: number = 0;

    constructor(name: string, queuePlayers: number = 8, teamCount: number = 2) {
        this.name = name;
        this.queuePlayers = queuePlayers;
        this.teamCount = teamCount;
    }

    async updateStats() {
        for(const partyID of this.parties) {
            let party = PartyManager.get(partyID);
            await party.updateRatingStats();
        }
    }

    queue(party: Party) {
        if (this.parties.includes(party.id)) return false;
        this.parties.push(party.id);
        return true;
    }

    leave(party: Party) {
        this.parties.splice(this.parties.indexOf(party.id), 1);
    }

    sort(sortMethod: (pA: Party, pB: Party) => number) {
        this.parties = this.parties.map(pid => PartyManager.get(pid)).sort(sortMethod).map(party=> party.id);
    }

    private resetSelector() {
        this.selector = new QueueSelector();
    }

    selectorStep(): string[][] | null {

        if (this.parties.reduce((acc, pid) => acc + PartyManager.get(pid).size,0) < this.queuePlayers) return null;

        this.selector.start = Math.min(this.selector.start, this.parties.length - 1);
        if (this.selector.start < 0) this.selector.start = 0;
        this.selector.end = Math.min(this.selector.end, this.parties.length);
        if (this.selector.end < 0) this.selector.end = 0;

        this.selectionTries++;

        let selectedPartyIDs = this.parties.slice(this.selector.start, this.selector.end);
        selectedPartyIDs = selectedPartyIDs.filter((u) => !this.selector.exclude.includes(u));

        let selectedParties = selectedPartyIDs.map(i => PartyManager.get(i));

        if (Queue.debugMode) Logger.log("Selected parties: {}", selectedParties.map(p=>p.size));
        if (Queue.debugMode) Logger.log("Selection indices: start {}, end {}, exclude {}", this.selector.start, this.selector.end, this.selector.exclude.length);

        let totalPlayers: number = selectedParties.reduce((acc, party) => acc + party.size, 0);
        const selectionFactor = Math.max(1, Math.floor(this.selectionTries / 40));

        if (Math.random() > .3 && selectionFactor > 2) {
            this.selector.start++;
            this.selector.end++;
        }

        if (selectedParties.length == 0) {
            this.resetSelector();
            return null;
        }

        if (totalPlayers > this.queuePlayers) {

            if (Queue.debugMode) Logger.log("Selected ({}) is bigger than wanted ({})", totalPlayers, this.queuePlayers);
            const sortFn = (p: Party, c: Party) => c.size - p.size;
            let overflowParties = selectedParties.filter(p => (totalPlayers - p.size) > this.queuePlayers).sort(sortFn);
            let perfectOverflowParties = selectedParties.filter(p => (totalPlayers - p.size) == this.queuePlayers).sort(sortFn);
            if (perfectOverflowParties.length > 0) {
                if (Queue.debugMode) Logger.log("Removing perfectly overflowing party with size {}", perfectOverflowParties[0].size);
                this.selector.exclude.push(perfectOverflowParties[0].id);
            } else if (overflowParties.length > 0) {
                if (Queue.debugMode) Logger.log("Removing overflowing party with size {}", overflowParties[0].size);
                this.selector.exclude.push(overflowParties[0].id);
            } else {
                if (Queue.debugMode) Logger.log("Expanding selection...");
                if (this.selector.end < this.parties.length) this.selector.end += selectionFactor;
                else if (this.selector.start > 0) this.selector.start -= selectionFactor;
            }

        } else if (totalPlayers == this.queuePlayers) {

            if (Queue.debugMode) Logger.log("Selected ({}) is equal to wanted ({})", totalPlayers, this.queuePlayers);
            const validAssignments: string[][][] = [];
            const numParties = selectedParties.length;
            const teamSize = this.queuePlayers/this.teamCount;

            const backtrack = (index: number, teamSizes: number[], teams: string[][]) => {
                if (index === numParties) {
                    if (teamSizes.every(size => size === teamSize)) {
                        validAssignments.push(teams.map(team => [...team]));
                    }
                    return;
                }

                for (let i = 0; i < teams.length; i++) {
                    if (teamSizes[i] + selectedParties[index].size <= teamSize) {
                        teams[i].push(selectedParties[index].id);
                        teamSizes[i] += selectedParties[index].size;
                        backtrack(index + 1, teamSizes, teams);
                        teamSizes[i] -= selectedParties[index].size;
                        teams[i].pop();
                    }
                }

                teams.push([selectedParties[index].id]);
                teamSizes.push(selectedParties[index].size);
                backtrack(index + 1, teamSizes, teams);
                teamSizes.pop();
                teams.pop();
            };

            backtrack(0, [], []);

            if (validAssignments.length > 0) {
                this.resetSelector();
                this.parties = this.parties.filter(p => !selectedPartyIDs.includes(p));
                this.selectionTries = 0;
                return validAssignments[Math.floor(Math.random() * validAssignments.length)];
            }

            if (Queue.debugMode) Logger.log("Expanding selection and resetting excludes...");
            this.selector.start -= selectionFactor;
            this.selector.end += selectionFactor;
            this.selector.exclude = [];

        } else {

            if (Queue.debugMode) Logger.log("Selected ({}) is smaller than wanted ({})", totalPlayers, this.queuePlayers);
            if (Queue.debugMode) Logger.log("Expanding selection...");
            if (this.selector.end < this.parties.length) this.selector.end += selectionFactor;
            else if (this.selector.start > 0) this.selector.start -= selectionFactor;
            else this.selector.exclude.splice(0, selectionFactor)

        }

        return null;

    }

}