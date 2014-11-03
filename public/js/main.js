/**
 * Created by focinfi on 14-7-28.
 */

window.onload = function(){

    initGameRes();

    //select the develop mode
    developMode(PLAY);

    document.onkeydown = checkKeyDown;

    gameRuntimeInterval = setInterval(
        function(){
            gameTime++;
        },
        10
    );

    gameBeginning();

}


function initGameRes(){
    canvas = document.getElementById("super_ball_canvas");
    canvas.width = CANVAS_HEIGHT;
    canvas.height = CANVAS_HEIGHT;
    canvasContext = canvas.getContext("2d");

    //game db functions init
    scoreDBFunctions = new gameScoreFunction.game_score_functions();
    bugDBFunctions = new gameBugFunction.game_bug_functions();

    //game UI init
    gameMessageShower = document.getElementById("game_message_shower");
    gameStateButton = document.getElementById("game_state_button");
    gameDebugShower = document.getElementById("game_debug_shower");
    gameScoreShower = document.getElementById("game_score_shower");
    lightRotation = document.getElementById("light_rotation");
    gameResultBoard = document.getElementById("game_result_board");
    gameBossDialog = document.getElementById("game_boss_dialog");

    nowTimeBoard = document.getElementById("now_score");
    nowHitBlocksBoard = document.getElementById("hit_blocks_num");
    bugBoard = document.getElementById("got_bugs_num");

    contentLeftBoard = document.getElementById("skills_list");
    contentRightBoard = document.getElementById("score_board");

    gameBestTimeBoard = document.getElementById("best_game_time");
    gameBestHitNumBoard = document.getElementById("best_hit_num");

    skillLightQ = document.getElementById("skill_light_q");
    skillLightW = document.getElementById("skill_light_w");

    //music init
    gameBackgroundMusic = document.createElement('audio');
    gameBackgroundMusic.src = "music/game_music.mp3";
    gameBackgroundMusic.loop = true;

    hitBlockMusic = document.createElement("audio");
    hitBlockMusic.src = "music/hit_blocks.mp3";

    hitBoardMusic = document.createElement("audio");
    hitBoardMusic.src = "music/hit_board.mp3";

    bombMusic = document.createElement("audio");
    bombMusic.src = "music/bomb.mp3";

    gameWinMusic = document.createElement("audio");
    gameWinMusic.src = "music/game_win.mp3";

    gameOverMusic = document.createElement("audio");
    gameOverMusic.src = "music/game_over.mp3";

    gameBugMusic = document.createElement("audio");
    gameBugMusic.src = "music/game_bug.mp3";

}


function gameBeginning(){
    initGame();
    gameState = GAME_BEGINNING;
    var game_beginning_count = 0;

    gameBeginningInterval= setInterval(
        function(){
            if(developMode == DEBUG){
                clearInterval(gameBeginningInterval);
                gameStart();
            }else{

                game_beginning_count++;

                render(canvasContext);
                checkHit();
                update();
                updateStateButtonRotation(game_beginning_count);
            }

        },
        10
    );

}

function countDown(){
    clearInterval(gameBeginningInterval);
    initGame();
    hideGameButton();

    gameBossAnimationInterval = setInterval(
        function(){
            canvasContext.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_HEIGHT *0.9);
            if(countdownStartNum == -90){
                clearInterval(gameBossAnimationInterval);
            }else{

                initBossBody();
                renderBossBody(canvasContext, bossBodyArray[5]);

                if(countdownStartNum <= 300){

                    for(var i = 0; i < bossBodyArray.length; i++){
                        if(bossBodyArray[i].level <= parseInt(15 - countdownStartNum/20))
                            renderBossBody(canvasContext, bossBodyArray[i]);
                    }
                    updateBossBody();
                }

            }

        },
        10
    )



    gameBeginningAnimationInterval = setInterval(
        function(){
            countdownStartNum -- ;

            updateCountdownAnimation(countdownStartNum);

            if(countdownStartNum == 300){
                showCountdownBoard(3);

            }else if(countdownStartNum == 200){
                showCountdownBoard(2);

            }else if(countdownStartNum == 100){
                showCountdownBoard(1);

            }else if(countdownStartNum == 0){
                showCountdownBoard("Go!");

            }else if(countdownStartNum == -100){
                hideCountdownBoard();
                clearInterval(gameBeginningAnimationInterval);
                gameStart();
            };

        },
        10
    );


}

function gameStart(){
    initGame();

    if(gameState != GAME_BEGINNING){
        hideGameButton();
        hideGameResultBoard();
    }

    gameState = GAME_START;

    gameStartInterval = setInterval(
        function(){

            if(gameState != GAME_RESUME && gameState != GAME_START) {
                clearInterval(gameStartInterval);
            }else{

                render(canvasContext);
                checkHit();
                update();}
        },
        10
    );

}

function gamePause(){
    gameState = GAME_PAUSE;
    showMessageForever("PAUSING...");
}

function gameResume(){
    gameState = GAME_RESUME;
    hideMessage();

    gameResumeInterval = setInterval(
        function(){

            if(gameState == GAME_PAUSE || gameState == GAME_OVER || gameState == GAME_WIN) {
                clearInterval(gameResumeInterval);
            }else{

                render(canvasContext);
                checkHit();
                update();
            }

        },
        10
    );
}

function gameWin(){
    gameState = GAME_WIN;
    setTimeout('showGameButton("RePlay")', 3000);
    scoreDBFunctions.insert();
    bugDBFunctions.insert();
    gameWinMusic.play();

//    game win animation
    nowGameTime = gameTime;
    initBossPieces();
    var win_start_num = 0;
    scoreShowerLeft = 0;
    gameWinAnimationInterval = setInterval(

        function(){
            canvasContext.clearRect(0, 0, CANVAS_HEIGHT, CANVAS_HEIGHT);
            if(gameState == GAME_START){
                clearInterval(gameWinAnimationInterval);
                bossPieces = [];
            }else{


//                gameDebugShower.textContent = gameState;

                win_start_num++;

                renderBossPiece(canvasContext);
                renderBall(canvasContext);
                renderWater(canvasContext);
                renderBoard(canvasContext);

                updateBossPiece(win_start_num);
                updateWater();
                updateScoreShowerAnimation(win_start_num);
            }
        },
        10
    );


}

function gameOver(type, words){
    gameState = GAME_OVER;

    setTimeout('showGameButton("RePlay")', 2500);
    showBossDialogSoon(bossHeartY, "Hwa-Hwa");
    if(type == BALL_DEAD){
//        setTimeout('showMessageSoon(getBallX(), words)', 500);
        setTimeout(function(){
            showMessageSoon(getBallX(), words);
        },
        2000);
    }else{
        setTimeout(function(){
                showMessageSoon(getBoardHeartX(), words);
            },
            2000);
    }

    bugDBFunctions.insert();
    gameOverMusic.play();

    bossBodyArray = [];


}

function gameBug(){
    gameState = GAME_OVER;
    setTimeout('showGameButton("RePlay")', 500);
    showMessageSoon(getBoardHeartX(), BUG_WORDS);
    bugDBFunctions.insert();

    gameBugMusic.play();
}


function render(context){
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    renderBlocks(context);

    renderBall(context);

    renderWater(context);

    renderBoard(context);


}

function checkHit(){

    checkGameState();

    checkHitBorder();

    if(ball.y > CANVAS_HEIGHT - board.width - SUPER_BALL_R &&
        ball.x >= board.x - SUPER_BALL_R * 2 &&
        ball.x <= board.x + board.width + SUPER_BALL_R * 2)
        checkHitBoard();

    if(ball.y < CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN) * blocks.shape.length + 2 * SUPER_BALL_R)
        checkHitBlocks();
}


function update(){

    updateBlocks();

    updateSuperBall();

    updateBoard();

    updateScore();

    updateWater();

    updateBossBody();




}

function checkKeyDown(event){
    switch (event.keyCode) {
        case 37:
            board.x -= 20;
            break;

        case 38:
            board.angle += Math.PI/40;
            break;

        case 39:
            board.x += 20;
            break;

        case 40:
            board.angle -= Math.PI/40;
            break;

        case 81: // Q
            board.x = skillQX;
            break;
        case 87: // W
            board.x = skillWX;
            break;
        case 69: // E
            board.fix_point = LEFT;
            if(board.x <= 0)
                board.x = 0;

            break;

        case 82: // R
            board.fix_point = RIGHT;
            if(board.x >= CANVAS_HEIGHT)
                board.x = CANVAS_HEIGHT;
            break;


        case 70: //F
            if(doubleBoardLengthAvailable){
                double_board_length = true;
                board.width *= 2;
                countDoubleBoardLength = 500;
            }
            break;

        case 80: //P
            if(gameState == GAME_START || gameState == GAME_RESUME)
                gamePause();
            else if(gameState == GAME_PAUSE)
                gameResume();
            break;
        default:break;
    }
}