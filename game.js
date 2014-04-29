var game = new Phaser.Game(480, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});
var playerBet, 
    cpuBet,
    ball,
    p1Score = 0,
    p2Score = 0,
    scorePlaceholder = "P1: 0 - P2: 0",
    score,
    ballRelease = false,
    cpuBetSpeed = 190,
    ballSpeed = 300;

function preload() {
    game.load.image('bat', 'assets/bet.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.image('background', 'assets/background.jpg');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.tileSprite(0, 0, 480, 600, 'background');
    var style = {fill: "white", align: "center"};
    score = game.add.text(10, game.world.centerY, scorePlaceholder, style); 
    playerBet = createBet(game.world.centerX, 580);
    cpuBet = createBet(game.world.centerX, 20);
    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    game.physics.arcade.enable(ball);
    ball.anchor.setTo(0.5, 0.5);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.setTo(1, 1);
    game.input.onDown.add(releaseBall, this);
    
}

function update() {
    playerBet.x = game.input.x;

    var playerBetHalfWidth = playerBet.width / 2;
    if (playerBet.x < playerBetHalfWidth) {
        playerBet.x = playerBetHalfWidth;
    } else if (playerBet.x > game.width - playerBetHalfWidth) {
        playerBet.x = game.width - playerBetHalfWidth;
    }

    if (cpuBet.x - ball.x < -15) {
        cpuBet.body.velocity.x = cpuBetSpeed;
    } else if (cpuBet.x - ball.x > 15) {
        cpuBet.body.velocity.x = -cpuBetSpeed;
    } else {
        cpuBet.body.velocity.x = 0;
    }

    game.physics.arcade.collide(ball, playerBet, ballHitsBet, null, this);
    game.physics.arcade.collide(ball, cpuBet, ballHitsBet, null, this);

    checkGoal();
}

function createBet(x, y) {
    var bet = game.add.sprite(x, y, 'bat');
    game.physics.arcade.enable(bet);
    bet.anchor.setTo(0.5, 0.5);
    bet.body.collideWorldBounds = true;
    bet.body.bounce.setTo(1, 1);
    bet.body.immovable = true;

    return bet;
}

function releaseBall() {
    if (!ballRelease) {
        ball.body.velocity.x = ballSpeed;
        ball.body.velocity.y = -ballSpeed;
        ballRelease = true;
    }
}

function ballHitsBet(_ball, _bat) {
    var diff = 0;

    if (_ball.x < _bat.x) {
        diff = _bat.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    } else if (_ball.x > _bat.x) {
        diff = _ball.x - _bat.x;
        _ball.body.velocity.x = (10 * diff);
    } else {
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function checkGoal() {
    if (ball.y < 15) {
        setBall();
        p1Score += 1;
    } else if (ball.y > 580) {
        setBall();
        p2Score += 1;
    }
    if (p1Score == 5 || p2Score == 5) {
        setBall();
        p1Score = 0;
        p2Score = 0;
        console.log("Game Over!");
    }
    score.text = "P1: " + p1Score + " - P2: " + p2Score;
}

function setBall() {
    if (ballRelease) {
        ball.x = game.world.centerX;
        ball.y = game.world.centerY;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ballRelease = false;
    }
}
