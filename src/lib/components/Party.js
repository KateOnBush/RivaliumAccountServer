class Party {

    constructor({id, users = [], owner}){

        this.id = id;
        this.users = users;
        this.owner = owner;

    }

    async getUsers(){

        let res = [];
        for(const uuid of this.users){

            res.push(await Database.fetchUser(uuid));

        }

        return res;

    }

    async getUser(id){

        if (this.users.includes(id)) return await Database.fetchUser(id);

    }

    disband(){

        this.getUsers().forEach(t=>{
            t.party = undefined;            
        })
        Database.Parties.splice(Database.Parties.findIndex(s=>s.id == this.id), 1);

    }

    addUser(user){

        this.users.push(user);

    }

    removeUser(user){

        this.users = this.users.filter(t=>t.id!==user);

    }

}

module.exports = Party;