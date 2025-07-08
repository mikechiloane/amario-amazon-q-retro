class Camera {
    constructor(canvas) {
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    follow(player) {
        this.x = player.x - this.width / 2;
        this.x = Math.max(0, Math.min(this.x, 1600 - this.width)); // world bounds
    }

    apply(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    }

    restore(ctx) {
        ctx.restore();
    }
}