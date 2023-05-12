


export enum ARENADIFFICULTY {
    VERYEASY = "Very Easy",
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
    VERYHARD = "Very Hard",
    EXTREME = "Extreme",
    INSANE = "Insane",
}


export function getDifficultiesInArray(): ARENADIFFICULTY[] {
    return [
        ARENADIFFICULTY.VERYEASY,
        ARENADIFFICULTY.EASY,
        ARENADIFFICULTY.MEDIUM,
        ARENADIFFICULTY.HARD,
        ARENADIFFICULTY.VERYHARD,
        ARENADIFFICULTY.EXTREME,
        ARENADIFFICULTY.INSANE
    ];
}


export function getDifficultyLevel(diff: ARENADIFFICULTY): number {
    switch (diff) {
        case ARENADIFFICULTY.VERYEASY:
            return 3;
        case ARENADIFFICULTY.EASY:
            return 5;
        case ARENADIFFICULTY.MEDIUM:
            return 8;
        case ARENADIFFICULTY.HARD:
            return 12;
        case ARENADIFFICULTY.VERYHARD:
            return 16;
        case ARENADIFFICULTY.EXTREME:
            return 20;
        case ARENADIFFICULTY.INSANE:
            return 25;
        default:
            return 0;
    }
}


export function getEnemyLevelsInDifficulty(diff: ARENADIFFICULTY): [number, number] {
    switch (diff) {
        case ARENADIFFICULTY.VERYEASY:
            return [1, 2];
        case ARENADIFFICULTY.EASY:
            return [1, 4];
        case ARENADIFFICULTY.MEDIUM:
            return [2, 6];
        case ARENADIFFICULTY.HARD:
            return [3, 10];
        case ARENADIFFICULTY.VERYHARD:
            return [5, 15];
        case ARENADIFFICULTY.EXTREME:
            return [5, 20];
        case ARENADIFFICULTY.INSANE:
            return [6, 25];
        default:
            return [0, 0];

    }

}
