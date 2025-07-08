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
    }

    setupInput() {
        document.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (this.gameState === 'quiz') {
                this.handleQuizInput(e.code);
            }
        });
        document.addEventListener('keyup', e => this.keys[e.code] = false);
    }

    handleQuizInput(keyCode) {
        if (this.showingResult) {
            if (keyCode === 'Space') {
                if (this.quizAnswers.filter(a => a).length >= 1) {
                    this.gameState = 'playing';
                } else {
                    this.restartGame();
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
        this.gameState = 'playing';
    }

    update() {
        if (this.gameState !== 'playing') return;
        
        this.player.update(this.keys);
        this.enemies.forEach(enemy => enemy.update(this.platforms));
        
        Collision.handlePlatforms(this.player, this.platforms);
        
        // Check enemy collision with quiz trigger
        this.enemies.forEach((enemy, i) => {
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
        });
        
        this.score += Collision.handleCoins(this.player, this.coins);
        
        // Check exit
        if (Collision.checkRect(this.player, this.exit)) {
            this.currentLevel = this.currentLevel >= 3 ? 1 : this.currentLevel + 1;
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
        
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.coins.forEach(coin => coin.draw(this.ctx));
        
        this.camera.restore(this.ctx);
    }

    drawQuiz() {
        // Quiz background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, 800, 400);
        
        // Quiz box
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(100, 80, 600, 240);
        this.ctx.strokeStyle = '#0f3460';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(100, 80, 600, 240);
        
        if (this.showingResult) {
            this.drawQuizResult();
            return;
        }
        
        // Question header
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`AWS QUIZ - Question ${this.currentQuestionIndex + 1}/2`, 400, 110);
        this.ctx.font = '10px monospace';
        this.ctx.fillText(this.currentQuestion.question, 400, 140);
        
        // Options with highlighting
        this.ctx.textAlign = 'left';
        this.currentQuestion.options.forEach((option, i) => {
            if (this.selectedAnswer === i) {
                const isCorrect = i === this.currentQuestion.correct;
                this.ctx.fillStyle = isCorrect ? '#00ff00' : '#ff0000';
            } else {
                this.ctx.fillStyle = '#fff';
            }
            this.ctx.fillText(`${i+1}) ${option}`, 120, 170 + i * 20);
        });
        
        // Instructions
        this.ctx.fillStyle = '#ffff00';
        this.ctx.textAlign = 'center';
        if (this.selectedAnswer === -1) {
            this.ctx.fillText('Press 1-4 to answer!', 400, 290);
        }
    }
    
    drawQuizResult() {
        const correctCount = this.quizAnswers.filter(a => a).length;
        const passed = correctCount >= 1;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '16px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('QUIZ RESULTS', 400, 130);
        
        this.ctx.font = '12px monospace';
        this.ctx.fillText(`Score: ${correctCount}/2`, 400, 160);
        
        this.ctx.fillStyle = passed ? '#00ff00' : '#ff0000';
        this.ctx.font = '14px monospace';
        this.ctx.fillText(passed ? 'PASSED!' : 'FAILED!', 400, 190);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '10px monospace';
        this.ctx.fillText(passed ? 'You may continue your journey!' : 'Back to Level 1!', 400, 220);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText('Press SPACE to continue', 400, 280);
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}