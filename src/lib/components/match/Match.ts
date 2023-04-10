import { id } from 'mongodb-typescript';
import MatchPlayerManager from './MatchPlayerManager';
import MatchType from './MatchTypes';
import {ObjectId} from 'mongodb';

class Match {

    @id
    id: ObjectId;
    type: MatchType = MatchType.NORMAL;
    playerManager: MatchPlayerManager = new MatchPlayerManager();
    createdAt: number;

    /*async save(db: Database){

        await db.saveMatch(this);

    }*/

}

export default Match;