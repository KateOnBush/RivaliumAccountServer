import Database from "../Database";
import {ObjectId} from 'mongodb';


export default class UserFriendManager {

    sentFriendRequests: string[] = [];
    receivedFriendRequests: string[] = [];
    friendList: string[] = [];
    
    async getFriendList(){

        let res = [];
        for(let friendID of this.friendList){
            res.push(await Database.fetchUser(friendID));
        }
        return res;

    }

    async sendFriendRequest(id: ObjectId){

        /*
        let id = await Database.findUserId(id);
        if (sent == null) throw "Didn't find any user with that name! Did you check the spelling?";

        if(this.friendList.includes(id)) throw "User already in friend list!";

        if (this.sentFriendRequests.includes(id)) throw "Friend request already sent to " + name + ".";
        this.sentFriendRequests.push(id);

        let pFriend = await Database.fetchUser(id);
        if (pFriend == undefined) throw Database.unexpectedErrorText("USER_REGISTRATION_MISMATCH");

        await pFriend.friendManager.receiveFriendRequest(this.id);

        await (await this.getUser()).save();

        return true;
        */

    }

    async receiveFriendRequest(id: ObjectId){

        /*
        this.receivedFriendRequests.push(id);

        //if user is connected, send them the notification!

        await (await this.getUser()).save();

        return true;
        */

    }

    async acceptFriendRequest(fromID: ObjectId){

        /*
        if (!this.receivedFriendRequests.includes(fromID)) throw "No such friend request.";

        if (this.friendList.includes(fromID)) throw "User already in friend list."

        let fromUser = await Database.fetchUser(fromID);
        if (fromUser == undefined) throw "User not found.";

        fromUser.friendManager.sentFriendRequests = fromUser.friendManager.sentFriendRequests.filter(t=>t!==this.user);
        this.receivedFriendRequests = this.receivedFriendRequests.filter(t=>t!==fromUser.id);
        fromUser.friendManager.friendList.push(this.user);
        this.friendList.push(fromUser.id);

        let thisUser = await this.getUser();
        await thisUser.save();
        await fromUser.save();
        */

    }

}