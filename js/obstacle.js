class Obstacle {
    constructor(x, y, type = 'spike') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.obstacles = {
            spike: { w: 16, h: 8, color: '#666', name: 'FIREWALL' },
            pit: { w: 32, h: 16, color: '#333', name: 'OUTAGE' },
            block: { w: 20, h: 20, color: '#8B4513', name: 'LEGACY' }
        };
        this.config = this.obstacles[type] || this.obstacles.spike;
        this.w = this.config.w;
        this.h = this.config.h;
        this.color = this.config.color;
    }

    draw(ctx) {
        // Blocky obstacle
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x-1, this.y-1, this.w+2, this.h+2);
        
        // Main obstacle blocks
        ctx.fillStyle = this.color;
        for (let i = 0; i < this.w; i += 4) {
            for (let j = 0; j < this.h; j += 4) {
                ctx.fillRect(this.x + i, this.y + j, 3, 3);
            }
        }
        
        // Type-specific details
        if (this.type === 'spike') {
            ctx.fillStyle = '#999';
            for (let i = 2; i < this.w; i += 4) {
                ctx.fillRect(this.x + i, this.y - 2, 2, 4);
            }
        } else if (this.type === 'pit') {
            ctx.fillStyle = '#111';
            ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, this.h - 8);
        }
        
        // Obstacle name
        ctx.fillStyle = '#fff';
        ctx.font = '5px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.name, this.x + this.w/2, this.y + this.h + 8);
    }
}