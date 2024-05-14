import ECharacter from "../../enums/ECharacter";

export default class UserInventory {

    skins: number[] = [0];
    ropes: number[] = [0];
    characters: number[] = [ECharacter.KENN];
    icons: number[] = [0];
    borders: number[] = [0];
    podiums: number[] = [0];

    addSkin(id: number){

        if (!this.skins.includes(id)) this.skins.push(id);

    }

    addCharacter(id: number){

        if (!this.characters.includes(id)) this.skins.push(id);

    }

    addRope(id: number){    

        if (!this.ropes.includes(id)) this.ropes.push(id);

    }

    addIcon(id: number) {
        if (!this.icons.includes(id)) this.icons.push(id);
    }

    addPodium(id: number) {
        if (!this.podiums.includes(id)) this.podiums.push(id);
    }

}