"use strict"

let scoreNum = {
    L:0,
    R:0
}

score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;

const gameOptions = {
    w: 600,
    h: 300,

    gameBoardLeftW: 5,
    gameBoardLeftH: 50,
    gameBoardLeftSpeed: 5,
    
    gameBoardRightW: 5,
    gameBoardRightH: 50,
    gameBoardRightSpeed: 5,

    ballRadius: 15
}



const moveBoard = {
    speedLeft:0,
    speedRight:0,

    yL:gameOptions.h/2-gameOptions.gameBoardLeftH/2,
    yR:gameOptions.h/2-gameOptions.gameBoardRightH/2,

    updateL:function () {
        if (
            ((this.yL + this.speedLeft)<0) ||
            ((this.yL + this.speedLeft)>gameOptions.h-gameOptions.gameBoardLeftH)
        ){
            this.speedLeft = 0;
        } else {
            this.yL += this.speedLeft;
        };
    },

    updateR:function () {
        if (
            ((this.yR + this.speedRight)<0) ||
            ((this.yR + this.speedRight)>gameOptions.h-gameOptions.gameBoardRightH)
        ){
            this.speedRight = 0;
        } else {
            this.yR += this.speedRight;
        };
    }
}

document.onkeydown = function (eo) {
    if(eo.keyCode === 16) {
        moveBoard.speedLeft=-gameOptions.gameBoardLeftSpeed;
    }
    if (eo.keyCode === 17) {
        moveBoard.speedLeft=gameOptions.gameBoardLeftSpeed;
    }
    if(eo.keyCode === 38) {
        moveBoard.speedRight=-gameOptions.gameBoardRightSpeed;
    }
    if (eo.keyCode === 40) {
        moveBoard.speedRight=gameOptions.gameBoardRightSpeed;
    }
}

document.onkeyup = function (eo) {
    if(eo.keyCode === 16) {
        moveBoard.speedLeft=0
    }
    if (eo.keyCode === 17) {
        moveBoard.speedLeft=0
    }
    if(eo.keyCode === 38) {
        moveBoard.speedRight=0
    }
    if (eo.keyCode === 40) {
        moveBoard.speedRight=0
    }
}

const ballMove = {
    speedX:0,
    speedY:0,
    x:gameOptions.w/2,
    y:gameOptions.h/2,

    update:function () {//шарик дошёл до левого края
        if (((this.x - gameOptions.ballRadius - gameOptions.gameBoardLeftW + this.speedX) <= 0) ||
                        //шарик дошёл до правого края
        (((this.x + this.speedX)) >= (gameOptions.w - gameOptions.ballRadius - gameOptions.gameBoardRightW))) {

            if (this.speedX < 0) {//шарик летит влево
                                // верхний край левой ракетки
                if ((this.y >= moveBoard.yL) &&
                                // нижний край левой ракетки
                (this.y <= (moveBoard.yL + gameOptions.gameBoardLeftH))) {
                                // дожимаем шарик к ракетке
                    this.x = gameOptions.gameBoardLeftW + gameOptions.ballRadius;
                                // отскок от ракетки
                    this.speedX = -this.speedX;
                                // продолжаем
                    setTimeout(game,40);
                                // подкрутка левой ракеткой
                    if (moveBoard.speedLeft<0)
                        this.speedY-=3;
                    else if (moveBoard.speedLeft>0)
                        this.speedY+=3;
                } else {
                    // дожимаем шарик к стене
                    this.x=gameOptions.ballRadius;
                    // остановка
                    this.speedX = 0;
                    this.speedY = 0;
                    // меняем счёт
                    scoreNum.R++;
                    score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;
                    start.disabled="";
                }
            } else {//шарик летит вправо
                                // верхний край правой ракетки
                if ((this.y >= moveBoard.yR) &&
                                // нижний край правой ракетки
                (this.y <= (moveBoard.yR + gameOptions.gameBoardRightH))) {
                                // дожимаем шарик к ракетке
                    this.x=gameOptions.w - gameOptions.gameBoardRightW - gameOptions.ballRadius;
                                // отскок от ракетки
                    this.speedX = -this.speedX;
                                // продолжаем
                    setTimeout(game,40);
                                // подкрутка правой ракеткой
                    if (moveBoard.speedRight<0)
                        this.speedY-=3;
                    else if (moveBoard.speedRight>0)
                        this.speedY+=3;
                } else {
                    // дожимаем шарик к стене
                    this.x=gameOptions.w - gameOptions.ballRadius;
                    // остановка
                    this.speedX = 0;
                    this.speedY = 0;
                    
                    scoreNum.L++;
                    score.innerHTML="SCORE: " + scoreNum.L + ' : ' + scoreNum.R;
                    start.disabled="";
                }
            }
        } else {//отскок от потолка
            if ((ballMove.y - gameOptions.ballRadius < 0)
            ||//отскок от потолка
            (ballMove.y + gameOptions.ballRadius > gameOptions.h)) {
                this.speedY = -this.speedY;
            }
            //движение прямо, если нет препядствия
            this.x+=this.speedX;
            this.y+=this.speedY;
            
            // продолжаем
            setTimeout(game,40);
        }
    }
}

function randomDiap(n,m) {
    return Math.floor(Math.random()*(m-n+1))+n;
}

function startGame() {
        // прячем кнопку
        start.disabled="disabled";
        // ракетки на позиции
            moveBoard.yL=gameOptions.h/2-gameOptions.gameBoardLeftH/2;
            moveBoard.yR=gameOptions.h/2-gameOptions.gameBoardRightH/2; 
        // шарик на центр
            ballMove.x=gameOptions.w/2;
            ballMove.y=gameOptions.h/2;
        // определяем случайную скорость и направление шарика
            ballMove.speedX=randomDiap(-5,5);
            ballMove.speedY=randomDiap(-1,1);

    setInterval(()=>ballMove.speedX*1.1,10000);//увеличиваем скорость через интервал
    paint();
    setTimeout(game,3000);
}

function game() {
    moveBoard.updateL();
    moveBoard.updateR();
    ballMove.update();
    paint();
}

function paint(){
    let canvas = document.getElementById('canvas');
    let gameArea = canvas.getContext('2d');
    gameArea.clearRect(0,0,gameOptions.w,gameOptions.h);
            // игровое поле
    gameArea.fillStyle='bisque';
    gameArea.fillRect(0,0,gameOptions.w,gameOptions.h);
    gameArea.strokeStyle='black';
    gameArea.lineWidth=1;
    gameArea.strokeRect(0,0,gameOptions.w,gameOptions.h);
            // левая ракетка
    gameArea.fillStyle='blue';
    gameArea.fillRect(1,moveBoard.yL,gameOptions.gameBoardLeftW,gameOptions.gameBoardLeftH);
    gameArea.strokeStyle='black';
    gameArea.lineWidth=1;
    gameArea.strokeRect(1,moveBoard.yL,gameOptions.gameBoardLeftW,gameOptions.gameBoardLeftH);
            // правая ракетка
    gameArea.fillStyle='green';
    gameArea.fillRect(gameOptions.w-gameOptions.gameBoardRightW,moveBoard.yR,gameOptions.gameBoardRightW,gameOptions.gameBoardRightH);
    gameArea.strokeStyle='black';
    gameArea.lineWidth=1;
    gameArea.strokeRect(gameOptions.w-gameOptions.gameBoardRightW,moveBoard.yR,gameOptions.gameBoardRightW,gameOptions.gameBoardRightH);
            // мяч
    gameArea.beginPath();
    gameArea.fillStyle='red';
    gameArea.arc(ballMove.x,ballMove.y,gameOptions.ballRadius,0,Math.PI*2);
    gameArea.fill();
    gameArea.stroke();
}

