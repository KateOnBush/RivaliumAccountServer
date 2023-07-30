import MatchPlayerEvent from "./MatchPlayerEvent";

export default class MatchPlayerData {

    kills: MatchPlayerEvent[];
    deaths: MatchPlayerEvent[];
    assists: MatchPlayerEvent[];
    team: 0 | 1;
    damageDealt: number;
    damageTaken: number;
    healingTaken: number;

}