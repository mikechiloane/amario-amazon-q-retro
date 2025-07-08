class Level {
    static get(levelNum) {
        switch(levelNum) {
            case 1: return level1;
            case 2: return level2;
            case 3: return level3;
            default: return level1;
        }
    }
}