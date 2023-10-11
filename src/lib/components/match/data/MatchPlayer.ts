import MatchPlayerData from "./MatchPlayerData";
import ECharacter from "../../../enums/ECharacter";

export default class MatchPlayer {

    userId: string;
    playerId: number;
    charId: ECharacter;
    joined: boolean = false;
    data: MatchPlayerData;
    access: number;

    constructor(userId: string) {
        this.userId = userId;
        this.access = Math.floor(Math.random() * 0xFFFF_FFFF);
    }

}