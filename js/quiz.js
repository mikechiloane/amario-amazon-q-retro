class Quiz {
    static questions = [
        {
            question: "Which AWS service is like a retro arcade cabinet - you pay per play?",
            options: ["A) EC2", "B) Lambda", "C) RDS", "D) S3"],
            correct: 1,
            service: "lambda"
        },
        {
            question: "Which service is like an old computer that runs 24/7 in your basement?",
            options: ["A) Lambda", "B) S3", "C) EC2", "D) RDS"],
            correct: 2,
            service: "ec2"
        },
        {
            question: "Which service is like a retro filing cabinet that never gets full?",
            options: ["A) EC2", "B) Lambda", "C) RDS", "D) S3"],
            correct: 3,
            service: "s3"
        },
        {
            question: "Which service is like an old library card catalog system?",
            options: ["A) S3", "B) RDS", "C) Lambda", "D) EC2"],
            correct: 1,
            service: "rds"
        },
        {
            question: "What does the λ symbol represent in AWS Lambda?",
            options: ["A) Greek letter Lambda", "B) Function symbol", "C) Both A and B", "D) AWS Logo"],
            correct: 2,
            service: "lambda"
        }
    ];

    static getRandomQuestion() {
        return this.questions[Math.floor(Math.random() * this.questions.length)];
    }
}