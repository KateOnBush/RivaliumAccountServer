export default class UserInventory {

    skins: number[] = [];
    ropes: number[] = [];
    characters: number[] = [0];

    addSkin(id: number){

        if(!this.skins.includes(id)) this.skins.push(id);

    }

    addCharacter(id: number){

        if(!this.characters.includes(id)) this.skins.push(id);

    }

    addRope(id: number){    

        if(!this.ropes.includes(id)) this.ropes.push(id);

    }

}