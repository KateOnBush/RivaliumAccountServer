import {ObjectId} from 'mongodb';
import MatchPlayer from './data/MatchPlayer';
import { PlayerID } from './MatchTypes';

class MatchPlayerManager {

    players: MatchPlayer[];
    teams: PlayerID[][];
    winner: number;

}

export default MatchPlayerManager;