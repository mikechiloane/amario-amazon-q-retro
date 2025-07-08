const level4 = {
    platforms: [
        {x: 0, y: 370, w: 1600, h: 30},
        {x: 80, y: 320, w: 60, h: 15},
        {x: 200, y: 280, w: 50, h: 15},
        {x: 320, y: 240, w: 40, h: 15},
        {x: 420, y: 200, w: 40, h: 15},
        {x: 520, y: 160, w: 40, h: 15},
        {x: 620, y: 120, w: 40, h: 15},
        {x: 720, y: 160, w: 60, h: 15},
        {x: 850, y: 200, w: 50, h: 15},
        {x: 970, y: 240, w: 50, h: 15},
        {x: 1100, y: 180, w: 40, h: 15},
        {x: 1220, y: 140, w: 40, h: 15},
        {x: 1340, y: 100, w: 60, h: 15},
        {x: 1480, y: 80, w: 80, h: 15}
    ],
    enemies: [
        {x: 100, y: 290, vx: 1, service: 'lambda'},
        {x: 220, y: 250, vx: -1, service: 'ec2'},
        {x: 340, y: 210, vx: 1, service: 'rds'},
        {x: 440, y: 170, vx: -1, service: 's3'},
        {x: 540, y: 130, vx: 1, service: 'lambda'},
        {x: 640, y: 90, vx: -1, service: 'ec2'},
        {x: 740, y: 130, vx: 1, service: 'rds'},
        {x: 870, y: 170, vx: -1, service: 's3'},
        {x: 990, y: 210, vx: 1, service: 'lambda'},
        {x: 1120, y: 150, vx: -1, service: 'ec2'}
    ],
    obstacles: [
        {x: 150, y: 360, type: 'spike'},
        {x: 280, y: 352, type: 'pit'},
        {x: 380, y: 360, type: 'spike'},
        {x: 480, y: 352, type: 'pit'},
        {x: 580, y: 360, type: 'block'},
        {x: 680, y: 352, type: 'spike'},
        {x: 800, y: 360, type: 'pit'},
        {x: 920, y: 352, type: 'spike'},
        {x: 1050, y: 360, type: 'block'},
        {x: 1180, y: 352, type: 'pit'},
        {x: 1280, y: 360, type: 'spike'},
        {x: 1400, y: 352, type: 'pit'}
    ],
    coins: [
        {x: 110, y: 290}, {x: 230, y: 250}, {x: 350, y: 210},
        {x: 450, y: 170}, {x: 550, y: 130}, {x: 650, y: 90},
        {x: 750, y: 130}, {x: 880, y: 170}, {x: 1000, y: 210},
        {x: 1130, y: 150}, {x: 1250, y: 110}, {x: 1360, y: 70},
        {x: 1500, y: 50}
    ],
    exit: {x: 1500, y: 320, w: 30, h: 50}
};