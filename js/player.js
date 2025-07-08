class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 30;
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.color = '#ff6b6b';
        this.expression = 'normal';
        this.name = 'IAM';
    }

    update(keys) {
        if (keys.ArrowLeft) this.vx = -5;
        else if (keys.ArrowRight) this.vx = 5;
        else this.vx = 0;
        
        if ((keys.Space || keys.ArrowUp) && this.grounded) {
            this.vy = -12;
            this.expression = 'happy';
        }
        
        this.vy += 0.5; // gravity
        this.x += this.vx;
        this.y += this.vy;
        
        // Update expression
        if (this.grounded && this.vx !== 0) this.expression = 'determined';
        else if (this.grounded) this.expression = 'normal';
        else if (this.vy > 0) this.expression = 'worried';
        
        // Keep player in world bounds
        this.x = Math.max(0, Math.min(this.x, 1600 - this.w));
    }

    draw(ctx) {
        // Blocky retro body with rough edges
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x-1, this.y-1, this.w+2, this.h+2);
        
        // Main body blocks
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.w; i += 4) {
            for (let j = 0; j < this.h; j += 4) {
                if ((i + j) % 8 === 0) {
                    ctx.fillRect(this.x + i, this.y + j, 4, 4);
                } else {
                    ctx.fillRect(this.x + i, this.y + j, 3, 3);
                }
            }
        }
        
        // Darker blocks for depth
        ctx.fillStyle = '#cc4444';
        ctx.fillRect(this.x+2, this.y+2, 2, 2);
        ctx.fillRect(this.x+6, this.y+6, 2, 2);
        ctx.fillRect(this.x+14, this.y+10, 2, 2);
        ctx.fillRect(this.x+10, this.y+18, 2, 2);
        
        // Blocky face
        ctx.fillStyle = '#000';
        if (this.expression === 'worried') {
            ctx.fillRect(this.x+4, this.y+6, 2, 4);
            ctx.fillRect(this.x+14, this.y+6, 2, 4);
        } else {
            ctx.fillRect(this.x+4, this.y+8, 4, 4);
            ctx.fillRect(this.x+12, this.y+8, 4, 4);
        }
        
        // Blocky mouth
        if (this.expression === 'happy') {
            ctx.fillRect(this.x+6, this.y+16, 2, 2);
            ctx.fillRect(this.x+8, this.y+18, 4, 2);
            ctx.fillRect(this.x+12, this.y+16, 2, 2);
        } else if (this.expression === 'worried') {
            ctx.fillRect(this.x+6, this.y+18, 2, 2);
            ctx.fillRect(this.x+8, this.y+16, 4, 2);
            ctx.fillRect(this.x+12, this.y+18, 2, 2);
        } else {
            ctx.fillRect(this.x+6, this.y+15, 8, 2);
        }
        
        // IAM label
        ctx.fillStyle = '#fff';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('IAM', this.x + this.w/2, this.y + this.h + 8);
    }

    reset() {
        this.x = 50;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
    }
}