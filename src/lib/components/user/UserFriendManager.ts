import Database from "../../classes/Database";
import {ObjectId} from 'mongodb';


export default class UserFriendManager {

    sentFriendRequests: string[] = [];
    receivedFriendRequests: string[] = [];
    friendList: string[] = [];
    
    async getFriendList(){

        let res = [];
        for(let friendID of this.friendList){
            const u = await Database.fetchUser(friendID);
            if (u) res.push(u);
        }
        return res;

    }

}