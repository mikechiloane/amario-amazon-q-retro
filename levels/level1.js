const level1 = {
    platforms: [
        {x: 0, y: 370, w: 1600, h: 30},
        {x: 200, y: 280, w: 100, h: 20},
        {x: 400, y: 200, w: 100, h: 20},
        {x: 600, y: 120, w: 100, h: 20},
        {x: 900, y: 250, w: 150, h: 20},
        {x: 1200, y: 180, w: 100, h: 20},
        {x: 1400, y: 100, w: 100, h: 20}
    ],
    enemies: [
        {x: 250, y: 250, vx: 1, service: 'ec2'},
        {x: 450, y: 170, vx: -1, service: 'lambda'},
        {x: 950, y: 220, vx: 1, service: 's3'},
        {x: 1250, y: 150, vx: -1, service: 'rds'}
    ],
    obstacles: [
        {x: 350, y: 360, type: 'spike'},
        {x: 700, y: 352, type: 'pit'},
        {x: 1100, y: 350, type: 'block'}
    ],
    coins: [
        {x: 230, y: 250}, {x: 430, y: 170}, {x: 630, y: 90},
        {x: 930, y: 220}, {x: 1230, y: 150}, {x: 1430, y: 70}
    ],
    exit: {x: 1500, y: 320, w: 30, h: 50}
};