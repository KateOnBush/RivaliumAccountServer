import Message from "../../../../types/Message";
import Party from "../../../../components/party/Party";

export default class ResUpdateParty extends Message {

    constructor(party: Party) {
        super("user.party", party.getData());
    }

}