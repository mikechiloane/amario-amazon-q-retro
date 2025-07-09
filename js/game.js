class Game {
    constructor() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        
        this.score = 0;
        this.keys = {};
        this.currentLevel = 1;
        this.gameState = 'playing'; // playing, quiz, result
        this.currentQuestion = null;
        this.quizQuestions = [];
        this.quizAnswers = [];
        this.selectedAnswer = -1;
        this.showingResult = false;
        this.currentQuestionIndex = 0;
        this.lastSafePosition = {x: 50, y: 300};
        
        this.camera = new Camera(this.canvas);
        this.player = new Player(50, 300);
        
        this.loadLevel(this.currentLevel);
        this.setupInput();
        this.gameLoop();
    }

    loadLevel(levelNum) {
        const levelData = Level.get(levelNum);
        this.platforms = levelData.platforms;
        this.exit = levelData.exit;
        
        this.enemies = levelData.enemies.map(e => new Enemy(e.x, e.y, e.vx, e.service));
        this.coins = levelData.coins.map(c => new Coin(c.x, c.y));
        this.obstacles = levelData.obstacles ? levelData.obstacles.map(o => new Obstacle(o.x, o.y, o.type)) : [];
    }

    setupInput() {
        document.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (this.gameState === 'quiz') {
                this.handleQuizInput(e.code);
            }
        });
        document.addEventListener('keyup', e => this.keys[e.code] = false);
        
        // Mobile controls
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');
        
        if (btnLeft) {
            btnLeft.addEventListener('touchstart', e => { e.preventDefault(); this.keys.ArrowLeft = true; });
            btnLeft.addEventListener('touchend', e => { e.preventDefault(); this.keys.ArrowLeft = false; });
        }
        if (btnRight) {
            btnRight.addEventListener('touchstart', e => { e.preventDefault(); this.keys.ArrowRight = true; });
            btnRight.addEventListener('touchend', e => { e.preventDefault(); this.keys.ArrowRight = false; });
        }
        if (btnJump) {
            btnJump.addEventListener('touchstart', e => { e.preventDefault(); this.keys.Space = true; });
            btnJump.addEventListener('touchend', e => { e.preventDefault(); this.keys.Space = false; });
        }
    }

    handleQuizInput(keyCode) {
        if (this.showingResult) {
            if (keyCode === 'Space') {
                if (this.quizAnswers.filter(a => a).length >= 1) {
                    this.player.x = this.lastSafePosition.x;
                    this.player.y = this.lastSafePosition.y;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.gameState = 'playing';
                    this.resetQuizState();
                } else {
                    this.player.x = 50;
                    this.player.y = 300;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    this.gameState = 'playing';
                    this.resetQuizState();
                }
            }
            return;
        }
        
        const answers = ['Digit1', 'Digit2', 'Digit3', 'Digit4'];
        const index = answers.indexOf(keyCode);
        if (index !== -1) {
            this.selectedAnswer = index;
            const isCorrect = index === this.currentQuestion.correct;
            this.quizAnswers.push(isCorrect);
            
            setTimeout(() => {
                if (this.quizAnswers.length >= 2) {
                    this.showingResult = true;
                } else {
                    this.nextQuestion();
                }
            }, 1500);
        }
    }

    showQuiz() {
        this.gameState = 'quiz';
        const allQuestions = [...Quiz.questions];
        this.quizQuestions = [
            allQuestions.splice(Math.floor(Math.random() * allQuestions.length), 1)[0],
            allQuestions.splice(Math.floor(Math.random() * allQuestions.length), 1)[0]
        ];
        this.quizAnswers = [];
        this.selectedAnswer = -1;
        this.showingResult = false;
        this.currentQuestion = this.quizQuestions[0];
        this.currentQuestionIndex = 0;
    }
    
    nextQuestion() {
        this.selectedAnswer = -1;
        this.currentQuestionIndex = 1;
        this.currentQuestion = this.quizQuestions[1];
    }

    restartGame() {
        this.currentLevel = 1;
        this.player.reset();
        this.loadLevel(this.currentLevel);
        this.resetQuizState();
        this.gameState = 'playing';
    }
    
    resetQuizState() {
        this.currentQuestion = null;
        this.quizQuestions = [];
        this.quizAnswers = [];
        this.selectedAnswer = -1;
        this.showingResult = false;
        this.currentQuestionIndex = 0;
    }
    
    isPlayerNearHazard() {
        // Check if player is near any enemy or obstacle
        const buffer = 60; // 3 steps back
        for (let enemy of this.enemies) {
            if (Math.abs(this.player.x - enemy.x) < buffer) return true;
        }
        for (let obstacle of this.obstacles) {
            if (Math.abs(this.player.x - obstacle.x) < buffer) return true;
        }
        return false;
    }

    update() {
        if (this.gameState !== 'playing') return;
        
        this.player.update(this.keys);
        this.enemies.forEach(enemy => enemy.update(this.platforms));
        
        Collision.handlePlatforms(this.player, this.platforms);
        
        // Check enemy collision with quiz trigger
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (Collision.checkRect(this.player, enemy)) {
                if (this.player.vy > 0 && this.player.y < enemy.y) {
                    this.enemies.splice(i, 1);
                    this.player.vy = -8;
                    this.score += 100;
                } else {
                    this.showQuiz();
                    return;
                }
            }
        }
        
        this.score += Collision.handleCoins(this.player, this.coins);
        
        // Update safe position if player is safe
        if (this.player.grounded && !this.isPlayerNearHazard()) {
            this.lastSafePosition = {x: this.player.x, y: this.player.y};
        }
        
        // Check obstacle collision
        this.obstacles.forEach(obstacle => {
            if (Collision.checkRect(this.player, obstacle)) {
                this.showQuiz();
                return;
            }
        });
        
        // Check exit
        if (Collision.checkRect(this.player, this.exit)) {
            this.currentLevel = this.currentLevel >= 5 ? 1 : this.currentLevel + 1;
            this.player.x = 50;
            this.player.y = 300;
            this.loadLevel(this.currentLevel);
        }
        
        this.camera.follow(this.player);
        this.scoreEl.textContent = `Score: ${this.score} | Level: ${this.currentLevel}`;
    }

    draw() {
        this.ctx.clearRect(0, 0, 800, 400);
        
        if (this.gameState === 'quiz') {
            this.drawQuiz();
            return;
        }
        
        this.camera.apply(this.ctx);
        
        // Retro background pattern
        this.ctx.fillStyle = '#3498db';
        for(let i = 0; i < 1600; i += 40) {
            for(let j = 0; j < 400; j += 40) {
                if((i + j) % 80 === 0) {
                    this.ctx.fillRect(i, j, 2, 2);
                }
            }
        }
        
        // Platforms with retro brick pattern
        this.platforms.forEach(p => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(p.x, p.y, p.w, p.h);
            this.ctx.fillStyle = '#A0522D';
            for(let i = 0; i < p.w; i += 16) {
                for(let j = 0; j < p.h; j += 8) {
                    this.ctx.fillRect(p.x + i + (j % 16 ? 8 : 0), p.y + j, 14, 6);
                }
            }
        });
        
        // Retro exit door
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.exit.x-2, this.exit.y-2, this.exit.w+4, this.exit.h+4);
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.exit.x, this.exit.y, this.exit.w, this.exit.h);
        this.ctx.fillStyle = '#00aa00';
        this.ctx.fillRect(this.exit.x+5, this.exit.y+10, 8, 20);
        this.ctx.fillRect(this.exit.x+17, this.exit.y+10, 8, 20);
        
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.coins.forEach(coin => coin.draw(this.ctx));
        
        this.camera.restore(this.ctx);
    }

    drawQuiz() {
        // Retro scanline background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        this.ctx.fillRect(0, 0, 800, 400);
        for (let i = 0; i < 400; i += 4) {
            this.ctx.fillStyle = 'rgba(0, 50, 100, 0.3)';
            this.ctx.fillRect(0, i, 800, 2);
        }
        
        // Blocky retro quiz container
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(80, 60, 640, 280);
        
        // Retro border blocks
        this.ctx.fillStyle = '#0f3460';
        for (let i = 80; i < 720; i += 8) {
            this.ctx.fillRect(i, 60, 6, 6);
            this.ctx.fillRect(i, 334, 6, 6);
        }
        for (let i = 60; i < 340; i += 8) {
            this.ctx.fillRect(80, i, 6, 6);
            this.ctx.fillRect(714, i, 6, 6);
        }
        
        // Inner container
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(100, 80, 600, 240);
        
        if (this.showingResult) {
            this.drawQuizResult();
            return;
        }
        
        // Blocky header
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(120, 90, 560, 20);
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 10px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`AWS QUIZ - Question ${this.quizAnswers.length + 1}/2`, 400, 103);
        
        // Question text with retro styling
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = '9px monospace';
        const words = this.currentQuestion.question.split(' ');
        let line = '';
        let y = 130;
        words.forEach(word => {
            if ((line + word).length > 60) {
                this.ctx.fillText(line, 400, y);
                line = word + ' ';
                y += 12;
            } else {
                line += word + ' ';
            }
        });
        this.ctx.fillText(line, 400, y);

        
        // Blocky option boxes
        this.ctx.textAlign = 'left';
        this.currentQuestion.options.forEach((option, i) => {
            const yPos = 180 + i * 25;
            
            // Option box
            if (this.selectedAnswer === i) {
                const isCorrect = i === this.currentQuestion.correct;
                this.ctx.fillStyle = isCorrect ? '#004400' : '#440000';
            } else {
                this.ctx.fillStyle = '#333';
            }
            this.ctx.fillRect(110, yPos - 8, 580, 18);
            
            // Option border
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(110, yPos - 8, 580, 18);
            
            // Option text
            if (this.selectedAnswer === i) {
                const isCorrect = i === this.currentQuestion.correct;
                this.ctx.fillStyle = isCorrect ? '#00ff00' : '#ff0000';
            } else {
                this.ctx.fillStyle = '#fff';
            }
            this.ctx.font = '8px monospace';
            this.ctx.fillText(`${i+1}) ${option}`, 120, yPos + 2);
        });
        
        // Retro instructions
        if (this.selectedAnswer === -1) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(200, 300, 400, 15);
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 8px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('>>> PRESS 1-4 TO ANSWER <<<', 400, 310);
        }
    }
    
    drawQuizResult() {
        const correctCount = this.quizAnswers.filter(a => a).length;
        const passed = correctCount >= 1;
        
        // Blocky result header
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(150, 100, 500, 25);
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('QUIZ RESULTS', 400, 118);
        
        // Score box
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(300, 140, 200, 20);
        this.ctx.strokeStyle = '#666';
        this.ctx.strokeRect(300, 140, 200, 20);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(`Score: ${correctCount}/2`, 400, 153);
        
        // Pass/Fail box
        this.ctx.fillStyle = passed ? '#004400' : '#440000';
        this.ctx.fillRect(250, 180, 300, 30);
        this.ctx.strokeStyle = passed ? '#00ff00' : '#ff0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(250, 180, 300, 30);
        
        this.ctx.fillStyle = passed ? '#00ff00' : '#ff0000';
        this.ctx.font = 'bold 14px monospace';
        this.ctx.fillText(passed ? '>>> PASSED! <<<' : '>>> FAILED! <<<', 400, 200);
        
        // Message box
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(200, 230, 400, 20);
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '8px monospace';
        this.ctx.fillText(passed ? 'You may continue your journey!' : 'Back to Level 1!', 400, 243);
        
        // Continue button
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(250, 270, 300, 20);
        this.ctx.fillStyle = '#000';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.fillText('>>> PRESS SPACE TO CONTINUE <<<', 400, 283);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}