import ERankTier from "../enums/ERankTier";
import ERankDivision from "../enums/ERankDivision";

interface RankTierRange {
    promotion: number,
    demotion: number,
    BasisToMedium: number,
    MediumToAltum: number
}

export default class RankSystem {

    private static readonly RankDivisionRange = (promotion: number, demotion: number, BasisToMedium: number, MediumToAltum: number) => {
        return {promotion, demotion, BasisToMedium, MediumToAltum}
    };

    private static readonly RankDivisionRangeList: Record<ERankTier, RankTierRange> = {
        [ERankTier.UNRANKED]:   RankSystem.RankDivisionRange(0, 0, 0, 0),
        [ERankTier.NOVICE]:     RankSystem.RankDivisionRange(0, 0, 150, 350),
        [ERankTier.TITANIUM]:   RankSystem.RankDivisionRange(500, 389, 650, 850),
        [ERankTier.GOLD]:       RankSystem.RankDivisionRange(1000, 898, 1150, 1350),
        [ERankTier.PLATINUM]:   RankSystem.RankDivisionRange(1500, 1407, 1650, 1850),
        [ERankTier.AMBER]:      RankSystem.RankDivisionRange(2000, 1916, 2150, 2350),
        [ERankTier.DIAMOND]:    RankSystem.RankDivisionRange(2500, 2425, 2650, 2850),
        [ERankTier.SENTINEL]:   RankSystem.RankDivisionRange(3000, 2934, 3200, 3200),
        [ERankTier.MERCENARY]:  RankSystem.RankDivisionRange(3400, 3341, 3600, 3600),
        [ERankTier.GRANDRIVAL]: RankSystem.RankDivisionRange(3800, 3748, 4000, Infinity),
    };
    public static getDivision(tier: ERankTier, rr: number): ERankDivision {

        let range = this.RankDivisionRangeList[tier];
        if (rr < range.BasisToMedium) return ERankDivision.BASIS;
        if (rr < range.MediumToAltum) return ERankDivision.MEDIUM;
        return ERankDivision.ALTUM;

    }

    public static updateTier(tier: ERankTier, rr: number): ERankTier {

        let range = this.RankDivisionRangeList[tier];
        if (rr < range.demotion) return tier - 1;
        if (tier != ERankTier.GRANDRIVAL && rr > this.RankDivisionRangeList[tier + 1 as ERankTier].promotion) return tier + 1;
        return tier;

    }

}