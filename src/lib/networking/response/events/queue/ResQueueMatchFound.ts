import Message from "../../../../types/Message";
import Match from "../../../../components/match/Match";

export default class ResQueueMatchFound extends Message {

    constructor(match: Match, access: number, display: boolean) {
        super("match.found", {
            match: match.getPreMatchData(),
            access,
            display
        });
    }

}