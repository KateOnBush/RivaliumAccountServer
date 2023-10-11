export default class UserSkill {

    tier: number = 1;
    xp: number = 0;
    mmr: number = 0;

    getMaxXP() {
        let l = this.tier;
        return Math.round(2000 * Math.sqrt(l) * Math.log10(l + 1));
    }

    checkTierUp() {
        let tierUp = false;
        while(this.xp >= this.getMaxXP()) {
            this.tier++;
            tierUp = true;
        }
        return tierUp;
    }

    addXP(amt: number) {
        this.xp += amt;
    }


}