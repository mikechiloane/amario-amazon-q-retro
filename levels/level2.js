const level2 = {
    platforms: [
        {x: 0, y: 370, w: 1600, h: 30},
        {x: 100, y: 300, w: 80, h: 20},
        {x: 300, y: 220, w: 80, h: 20},
        {x: 500, y: 140, w: 80, h: 20},
        {x: 700, y: 200, w: 200, h: 20},
        {x: 1000, y: 280, w: 100, h: 20},
        {x: 1300, y: 150, w: 120, h: 20}
    ],
    enemies: [
        {x: 130, y: 270, vx: 1, service: 'lambda'},
        {x: 330, y: 190, vx: -1, service: 'ec2'},
        {x: 750, y: 170, vx: 1, service: 'rds'},
        {x: 1030, y: 250, vx: -1, service: 's3'}
    ],
    obstacles: [
        {x: 220, y: 360, type: 'spike'},
        {x: 500, y: 352, type: 'pit'},
        {x: 900, y: 350, type: 'block'},
        {x: 1200, y: 360, type: 'spike'}
    ],
    coins: [
        {x: 150, y: 270}, {x: 350, y: 190}, {x: 550, y: 110},
        {x: 750, y: 170}, {x: 1050, y: 250}, {x: 1350, y: 120}
    ],
    exit: {x: 1500, y: 320, w: 30, h: 50}
};