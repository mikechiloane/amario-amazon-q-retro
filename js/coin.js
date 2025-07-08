class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 10;
        this.color = '#ffff00';
    }

    draw(ctx) {
        // Retro spinning coin effect
        const time = Date.now() * 0.01;
        const scale = Math.abs(Math.sin(time)) * 0.5 + 0.5;
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x-1, this.y-1, this.w+2, this.h+2);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x + (1-scale)*this.w/2, this.y, this.w*scale, this.h);
        // Add shine
        ctx.fillStyle = '#ffff88';
        ctx.fillRect(this.x + 2, this.y + 2, 2, 2);
    }
}