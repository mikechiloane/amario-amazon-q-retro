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
        // Box outline
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x-1, this.y-1, this.w+2, this.h+2);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        
        // Draw face based on expression
        ctx.fillStyle = '#000';
        
        // Eyes
        if (this.expression === 'worried') {
            ctx.fillRect(this.x+4, this.y+6, 2, 4); // worried eyes
            ctx.fillRect(this.x+14, this.y+6, 2, 4);
        } else {
            ctx.fillRect(this.x+5, this.y+8, 3, 3); // normal eyes
            ctx.fillRect(this.x+12, this.y+8, 3, 3);
        }
        
        // Mouth
        if (this.expression === 'happy') {
            ctx.fillRect(this.x+6, this.y+16, 2, 2); // smile
            ctx.fillRect(this.x+8, this.y+18, 4, 2);
            ctx.fillRect(this.x+12, this.y+16, 2, 2);
        } else if (this.expression === 'worried') {
            ctx.fillRect(this.x+6, this.y+18, 2, 2); // frown
            ctx.fillRect(this.x+8, this.y+16, 4, 2);
            ctx.fillRect(this.x+12, this.y+18, 2, 2);
        } else if (this.expression === 'determined') {
            ctx.fillRect(this.x+7, this.y+17, 6, 2); // straight line
        } else {
            ctx.fillRect(this.x+7, this.y+15, 6, 2); // normal
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