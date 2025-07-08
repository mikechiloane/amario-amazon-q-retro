const level3 = {
    platforms: [
        {x: 0, y: 370, w: 1600, h: 30},
        {x: 150, y: 320, w: 60, h: 15},
        {x: 280, y: 270, w: 60, h: 15},
        {x: 410, y: 220, w: 60, h: 15},
        {x: 540, y: 170, w: 60, h: 15},
        {x: 670, y: 120, w: 60, h: 15},
        {x: 800, y: 180, w: 120, h: 20},
        {x: 1000, y: 240, w: 80, h: 20},
        {x: 1200, y: 160, w: 100, h: 20},
        {x: 1400, y: 80, w: 80, h: 20}
    ],
    enemies: [
        {x: 170, y: 290, vx: 1, service: 'ec2'},
        {x: 300, y: 240, vx: -1, service: 'lambda'},
        {x: 430, y: 190, vx: 1, service: 's3'},
        {x: 820, y: 150, vx: -1, service: 'rds'},
        {x: 1020, y: 210, vx: 1, service: 'lambda'},
        {x: 1220, y: 130, vx: -1, service: 'ec2'}
    ],
    obstacles: [
        {x: 250, y: 360, type: 'spike'},
        {x: 380, y: 352, type: 'pit'},
        {x: 600, y: 350, type: 'block'},
        {x: 950, y: 360, type: 'spike'},
        {x: 1150, y: 352, type: 'pit'}
    ],
    coins: [
        {x: 180, y: 290}, {x: 310, y: 240}, {x: 440, y: 190},
        {x: 570, y: 140}, {x: 700, y: 90}, {x: 850, y: 150},
        {x: 1050, y: 210}, {x: 1250, y: 130}, {x: 1450, y: 50}
    ],
    exit: {x: 1500, y: 320, w: 30, h: 50}
};