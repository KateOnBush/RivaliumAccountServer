import Database from "../../classes/Database";
import User from "./User";


export default class UserFriendManager {

    sentFriendRequests: string[] = [];
    receivedFriendRequests: string[] = [];
    friendList: string[] = [];
    
    async getFriendList(){

        let res: User[] = [];
        for(let friendID of this.friendList){
            const u = await Database.fetchUser(friendID);
            if (u) res.push(u);
        }
        return res;

    }

}