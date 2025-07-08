class Level {
    static get(levelNum) {
        switch(levelNum) {
            case 1: return level1;
            case 2: return level2;
            case 3: return level3;
            case 4: return level4;
            case 5: return level5;
            default: return level1;
        }
    }
}