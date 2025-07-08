class Collision {
    static checkRect(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }

    static handlePlatforms(player, platforms) {
        player.grounded = false;
        platforms.forEach(p => {
            if (this.checkRect(player, p)) {
                if (player.vy > 0) {
                    player.y = p.y - player.h;
                    player.vy = 0;
                    player.grounded = true;
                }
            }
        });
    }

    static handleEnemies(player, enemies) {
        let score = 0;
        enemies.forEach((enemy, i) => {
            if (this.checkRect(player, enemy)) {
                if (player.vy > 0 && player.y < enemy.y) {
                    enemies.splice(i, 1);
                    player.vy = -8;
                    score += 100;
                } else {
                    player.reset();
                }
            }
        });
        return score;
    }

    static handleCoins(player, coins) {
        let score = 0;
        coins.forEach((coin, i) => {
            if (this.checkRect(player, coin)) {
                coins.splice(i, 1);
                score += 50;
            }
        });
        return score;
    }
}