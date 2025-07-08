class Enemy {
    constructor(x, y, vx = 1, service = 'ec2') {
        this.x = x;
        this.y = y;
        this.w = 15;
        this.h = 15;
        this.vx = vx;
        this.service = service;
        this.services = {
            ec2: { color: '#ff9900', symbol: 'EC2', behavior: 'normal' },
            lambda: { color: '#ff9900', symbol: 'λ', behavior: 'fast' },
            rds: { color: '#3f48cc', symbol: 'DB', behavior: 'slow' },
            s3: { color: '#569a31', symbol: 'S3', behavior: 'bounce' }
        };
        this.config = this.services[service] || this.services.ec2;
        this.color = this.config.color;
        this.bounceOffset = 0;
    }

    update(platforms) {
        // Service-specific behaviors
        let speed = Math.abs(this.vx);
        if (this.config.behavior === 'fast') speed = 2; // Lambda is fast
        if (this.config.behavior === 'slow') speed = 0.5; // RDS is slow
        
        this.vx = this.vx > 0 ? speed : -speed;
        this.x += this.vx;
        
        // S3 bounces vertically
        if (this.config.behavior === 'bounce') {
            this.bounceOffset += 0.1;
        }
        
        // Bounce off world bounds and platforms
        if (this.x <= 0 || this.x + this.w >= 1600) {
            this.vx *= -1;
        }
        
        platforms.forEach(p => {
            if (this.x < p.x + p.w && this.x + this.w > p.x &&
                this.y < p.y + p.h && this.y + this.h > p.y) {
                if (this.x <= p.x || this.x + this.w >= p.x + p.w) this.vx *= -1;
            }
        });
    }

    draw(ctx) {
        const yPos = this.y + (this.config.behavior === 'bounce' ? Math.sin(this.bounceOffset) * 3 : 0);
        
        // Service box with outline
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x-1, yPos-1, this.w+2, this.h+2);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, yPos, this.w, this.h);
        
        // Service symbol
        ctx.fillStyle = '#fff';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.config.symbol, this.x + this.w/2, yPos + this.h/2 + 1);
        
        // Service-specific decorations
        if (this.service === 'lambda') {
            ctx.fillStyle = '#ffcc00';
            ctx.fillRect(this.x+1, yPos+1, 2, 2); // serverless spark
        } else if (this.service === 'rds') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x+12, yPos+2, 2, 1); // database lines
            ctx.fillRect(this.x+12, yPos+5, 2, 1);
        }
    }
}