/**
 * Created by focinfi on 14-7-30.
 */

//get board.x
function getBoardX(){
    var n = board.width * Math.cos(board.angle);
    if(board.fix_point == LEFT)
        return board.x + n;
    else
        return board.x + board.width - n;

}

//get board y
function getBoardY(){
    return board.y - board.weight/2 - board.width * Math.sin(board.angle);
}

function getBallX(){
    return ball.x/CANVAS_HEIGHT * 100 + 2 + "%";
}

function getBoardHeartX(){
    return boardHeartX/CANVAS_HEIGHT * 100 + 2 + "%";
}

//get ball's placement

function getBallPointOfFall(){
    return ball.x + ball.vx * (CANVAS_HEIGHT - ball.y - 14) / ball.vy - board.width/2;
}

function getProbability(probability){
    return Math.random() < probability/100;
}


function getBlockColor(block_type){
    var color;

    switch(block_type){
        case -3:
            color = "red";
            break;
        case -2:
            color = "black";
            break;
        case -1:
            color = "white";
            break;
        default:
            color = BLOCK_COLORS[block_type];
            break;
    }

    return color;
}

function getColorWithAlpha(){

    red_n ++;
    if(red_n >= 255)
        red_n = 0;
    return "rgb("+ red_n +", 0, 0)";
}

function setGameResultData(){
    if(newRecord)
        document.getElementById("win_words").textContent = "New Record";

    document.getElementById("result_time").textContent = "Time: " + parseInt(nowGameTime/100/60) + "'" + parseInt(nowGameTime/100%60) + "''";

    document.getElementById("result_hit").textContent = "Hit: " + hitBlocksNum;

    document.getElementById("new_bug_num").textContent = "Bug: " + bugNum;
}

function changeVelocityAfterHit(type){
    switch(type){
        case VY:
            ball.vy *= -1;
            break
        case VX:
            ball.vx *= -1;
            break;
        case VX_Y:
            ball.vx *= -1;
            ball.vy *= -1;
            break;
        case I:
            if(ball.speed_up){
                ball.vx = 20 * BALL_SPEED_UP_TIMES;
                ball.vy = -20 * BALL_SPEED_UP_TIMES;
            }else{
                ball.vx = 20;
                ball.vy = -20;
            }

            break;
        case II:
            if(ball.speed_up){
                ball.vx = -20 * BALL_SPEED_UP_TIMES;
                ball.vy = -20 * BALL_SPEED_UP_TIMES;
            }else{
                ball.vx = -20;
                ball.vy = -20;
            }
            break;
        case III:
            if(ball.speed_up){
                ball.vx = -20 * BALL_SPEED_UP_TIMES;
                ball.vy = 20 * BALL_SPEED_UP_TIMES;
            }else{
                ball.vx = -20;
                ball.vy = 20;
            }
            break;
        case V:

            if(ball.speed_up){
                ball.vx = -20 * BALL_SPEED_UP_TIMES;
                ball.vy = -20 * BALL_SPEED_UP_TIMES;
            }else{
                ball.vx = -20;
                ball.vy = -20;
            }
            break;
        default : break;

    }
}

function afterHitBlocks(i, j){

    hitBlockMusic.play();

    if(blocks.shape[i][j] > 0){
        hitBlocksNum++;
    }

    if(blocks.shape[i][j] == 3){
        if(!ball.speed_up){
            ball.speed_up = true;
            ball.vx *= BALL_SPEED_UP_TIMES;
            ball.vy *= BALL_SPEED_UP_TIMES;
        }
        countSpeedUp += 200;
    }

    if(blocks.shape[i][j] > 0)
        blocks.shape[i][j]--;

    if(blocks.type == BOSS && blocks.shape[i][j] == -3){
        if(gameState == GAME_BEGINNING){
            gameBeginningRestart("GAME WIN!");
        }else{
            gameWin();
        }
    }
}

function adjustBallPosition(direction){
    switch(direction){
        case I:
            ball.x += blocks.vx;
            break;
        case II:
            ball.x -= -1 * blocks.vx;
            break;
        case III:
            ball.x -= -1 * blocks.vx;
            break;
        case V:
            ball.x += blocks.vx;
            break;
    }
}

function developMode(type){
    switch (type){
        case DEBUG:
            Element.setElementStyle(gameDebugShower, "display", "block");
            Element.setElementStyle(document.getElementById("game_title"), "display", "none");
            Element.setElementStyle(contentLeftBoard, "left", "-35.5%");
            Element.setElementStyle(contentRightBoard, "left", "100%");
            developMode = DEBUG;
            break;
        case PLAY:
            developMode = PLAY;
            Element.setElementStyle(gameDebugShower, "display", "none");
            Element.setElementStyle(document.getElementById("game_title"), "display", "block");
        default :break;

    }
}


//game init
function initGame(){

    //bg music
    gameBackgroundMusic.play();

    //scoreboard
    scoreDBFunctions.query();
    bugDBFunctions.query();

    if(bestGameTime == null)
        gameBestTimeBoard.textContent = "Time: Null"
    else
        gameBestTimeBoard.textContent ="Time: " + parseInt(bestGameTime/100/60) + "'" + parseInt(bestGameTime/100%60) + "''";

    gameBestHitNumBoard.textContent = "Hit: " + parseInt(bestHitBlocksNum);
    bugBoard.textContent = "Bug: " + parseInt(bugNum);
    nowTimeBoard.textContent = "Time: 0'0''";
    nowHitBlocksBoard.textContent = "Hit: 0";

    //game state
    gameTime = 0;

    //board
    board.width = BOARD_WIDTH;
    double_board_length = false;
    doubleBoardLengthAvailable = true;
    countDoubleBoardLength = 0;
    hitBlocksNum = 0;

    //ball
    ball.x = BALL_X - Math.random() * 200;
    ball.y = BALL_Y;
    ball.vx = BALL_VX + Math.random() * 5;
    ball.vy = BALL_VY - Math.random() * 5;
    ball.speed_up = false;

    //blocks and boss
    blocks.margin_left = BLOCK_MARGIN_LEFT;
    countCannonTime = 0;
    blocks.shape = deepCopyArray(SHAPES[2]);
    bossCannonsArray = deepCopyArray(BOSSES_CANNONS_ARRAYS[0]);
    bossOffset = 2;
    bossLeftOffsetDirection = RIGHT;
    bombs = [];

    //score shower
    scoreShowerLeft = 0,
    scoreShowerSkew = 20;

}


function initLasers(){
    if(lasers.length < bossCannonsArray.length){

        for(var w = 0; w < bossCannonsArray.length * 2; w ++){

            if(w % 2 == 0){
                var laser_right = {
                    x : 0,
                    length : 0,
                    color : "red",
                    offset : BLOCk_WIDTH/8 * w,
                    vx : 1,
                    vy : 1,
                    a : 1,
                    direction : RIGHT,
                    shot_time : 0}

                lasers.push(laser_right);
            }else{
                var laser_left = {
                    x : 0,
                    length : 0,
                    offset : -1 * BLOCk_WIDTH/8 * (w - 1),
                    vx : -1,
                    vy : 1,
                    a : 1,
                    direction : LEFT,
                    shot_time : 0}

                lasers.push(laser_left);
            }
        }
    }
}

function initLighting(){
    lightingArray = [];
    if(lightingArray.length < 10)
        for(var i = 0; i < 10; i++){
            var lighting = {
                x: BLOCk_WIDTH/10 * i + BLOCk_WIDTH/20 + cannon.x,
                y: cannon.y,
                node_array : new Array()
            }
            var lighting_length_now = 0;
            var lighting_node_left = true;

            for(var j = 1; lighting_length_now <= countCannonTime % 1000 - 500 + BLOCk_WIDTH/4 - Math.abs(i - 4.5) - 2; j++){
                lighting.node_array[j] = new Array();

                if(lighting_node_left){
                    var random_x = lighting.x - Math.random() * BLOCk_WIDTH/10;
                    lighting_node_left = false;
                }else{
                    var random_x = lighting.x + Math.random() * BLOCk_WIDTH/10;
                    lighting_node_left = true;
                }

                var random_y = Math.random() * 1 + 2;
                lighting.node_array[j][0] = parseInt(random_x);
                lighting.node_array[j][1] = parseInt(random_y + lighting_length_now + cannon.y);

                lighting_length_now += random_y;
            }

            lightingArray.push(lighting);
        }
}

function addBombs(){
    if(countCannonTime%100 == 99){
        var bomb = {
            x: cannon.x,
            y: cannon.y + BLOCk_WIDTH,
            vy: 1
        }
//    gameDebugShower.textContent = bombs.length + "_" + bomb.x;

        bombs.push(bomb);
    }
}

function initWater(){
    for(var i = 0; i < 50; i++){
        var water = {
            x_bottom: CANVAS_HEIGHT/50 * i + CANVAS_HEIGHT/100,
            y_bottom: CANVAS_HEIGHT,
            x_top: CANVAS_HEIGHT/50 * i + CANVAS_HEIGHT/100,
            y_top: CANVAS_HEIGHT - (10 - Math.abs(4.5 - i%10)),
            v: 0.1,
            color: colors[6]
        }

        waters.push(water);
    }
}

function initBossBody(){
    var boss_shape = deepCopyArray(blocks.shape);

    if(bossBodyArray.length < 1){
        for(var j = 1; j < boss_shape[0].length - 1; j++){
            var boss_body = {
                x: 0,
                y: 0,
                to_top:BLOCK_MARGIN,
                to_left: blocks.margin_left + j * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
                form_top: CANVAS_PADDING,
                form_left: blocks.margin_left + j * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5) - 60,
                vx: 0.001,
                vy: 1,
                a: 1.1,
                level: Math.abs(5 - j),
                direction: LEFT,
                blocks : new Array()
            };

            if(j == 5 ){
                boss_body.form_left = boss_body.to_left = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * 5 + 2.5;
                boss_body.vx = 0;
            }else if(j > 5){
                boss_body.direction = RIGHT;
                boss_body.form_left += 120;
                boss_body.vx *= -1;
            }

            for(var i = 0; i < boss_shape.length - 3; i++){
                boss_body.blocks[i] = new Array();
                if(boss_shape[i][j] == -2)
                    boss_body.blocks[i][0] = boss_shape[i][j] + 1;
                else
                    boss_body.blocks[i][0] = boss_shape[i][j];
            }

            bossBodyArray.push(boss_body);


            //get black array
            if(Math.abs(j - 5) == 3){
                var vertical_black = {
                    x: 0,
                    y: 0,
                    to_top: CANVAS_PADDING,
                    to_left: blocks.margin_left + j * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
                    form_top: CANVAS_PADDING - 60,
                    form_left: blocks.margin_left + j * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
                    vx: 0.001,
                    vy: 0.001,
                    a: 1.1,
                    level: 5,
                    direction: TOP,
                    blocks : new Array()
                };

                for(var i = 0; i < boss_shape.length - 3; i++){
                    vertical_black.blocks[i] = new Array();
                    if(boss_shape[i][j] == 1)
                        vertical_black.blocks[i][0] = boss_shape[i][j] - 2;
                    else
                        vertical_black.blocks[i][0] = boss_shape[i][j];
                }

                bossBodyArray.push(vertical_black);
            }
        }


        //get horizontal black blocks
        var horizontal_black = {
            x: 0,
            y: 0,
            to_top:CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN) * 3,
            to_left: blocks.margin_left + 4 * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
            form_top: CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN) * 3 + 60,
            form_left: blocks.margin_left + 4 * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
            vx: 0.001,
            vy: -0.001,
            a: 1.1,
            level: 5,
            direction: BOTTOM,
            blocks : [[-2, -2, -2]]
        };

        bossBodyArray.push(horizontal_black);
        console.log(horizontal_black);



//        //get boss_leg
        var boss_leg_left = {
            x: 0,
            y: 0,
            to_top:CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN) * 5,
            to_left: blocks.margin_left,
            form_top: CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN + 0.5) * 5 + 100,
            form_left: blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN),
            vx: 0.001,
            vy: -0.0000001,
            a: 1.2,
            level: 6,
            direction: BOTTOM,
            blocks : [
                [-1, -2, -1],
                [ 1,  3,  1],
                [-2, -1, -2]
            ]
        }

        bossBodyArray.push(boss_leg_left);

        var boss_leg_right = {
            x: 0,
            y: 0,
            form_top: CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN + 0.5) * 5 + 100,
            form_left: blocks.margin_left + 7 * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
            to_top:CANVAS_PADDING + (BLOCk_WIDTH + BLOCK_MARGIN) * 5,
            to_left: blocks.margin_left + 8 * (BLOCk_WIDTH + BLOCK_MARGIN + 0.5),
            vx: 0.001,
            vy: -0.0000001,
            a: 1.2,
            level: 7,
            direction: BOTTOM,
            blocks : [
                [-1, -2, -1],
                [ 1,  3,  1],
                [-2, -1, -2]
            ]
        }

        bossBodyArray.push(boss_leg_right);
    }
}

function initBossPieces(){

    if(bossPieces.length < 1)
        for(var i = 0; i < blocks.shape.length; i++)
            for(var j = 0; j < blocks.shape[i].length; j++){
                var boss_piece = {
                    x: blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j,
                    y: blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i,
                    vx: 0.1 + Math.random(),
                    vy: -5 - Math.random()*5,
                    a: 1 + Math.random() * 1.5,
                    color_number: blocks.shape[i][j]
                }

                if(getProbability(50))
                    boss_piece.vx *= -1;

                bossPieces.push(boss_piece);

            }
    console.log(bossPieces.length);

}




//UI support
Element.setElementStyle = function(element, key, value){
    element.setAttribute("style", key + ":" + value);
}

Element.showWithScale = function(element, left, words){
    element.textContent = words;
    var scale_time = 0;
    var scale_interval = setInterval(
        function(){
            if(scale_time >= 100){
                clearInterval(scale_interval);
                gameButtonLock = true;

            }
//            gameDebugShower.textContent = left;
            var style = "left:" + left + ";";
            Element.setElementStyle(element, style + "transform", "scale("+ (scale_time/100).toString() +")");
            scale_time++;

        }
    );
}


Element.hideWithAnimation = function(element, left){

//    var le = element.getAttribute("style");
//    alert(le)
    var scale_time = 100;
    var scale_interval = setInterval(
        function(){
            if(scale_time <= 0){
                clearInterval(scale_interval);
            }
            var style = "left:" + left + ";";
            Element.setElementStyle(element, style + "transform", "scale("+ (scale_time/100).toString() +")");
            scale_time--;

        }
    );
}

Element.show = function(element, words){
    element.textContent = words;
    Element.setElementStyle(element, "visibility", "visible");
}

Element.hide = function(element){
    Element.setElementStyle(element, "visibility", "hidden");
}

function setCss(element, key, value){
    Element.setElementStyle(element, key, value);
}


function showMessageSoon(left, words){
//    Element.setElementStyle(gameMessageShower, "left", (getBallX()).toString()+"%");
//    setCss(gameMessageShower, "left", "10%");
    Element.showWithScale(gameMessageShower, left, words);

    setTimeout(function(){
            Element.hideWithAnimation(gameMessageShower, left);
            game_message_shower_lock = false
        },
        2000
    );
}

function showBossDialogSoon(left, words){
//    Element.setElementStyle(gameMessageShower, "left", (getBallX()).toString()+"%");
//    setCss(gameMessageShower, "left", "10%");
    Element.showWithScale(gameBossDialog, left, words);

    setTimeout(function(){
            Element.hideWithAnimation(gameBossDialog, left);
            game_message_shower_lock = false
        },
        2000
    );
}


function showMessageForever(words){
    Element.showWithScale(gameMessageShower, getBoardHeartX(), words);
}

function hideMessage(){
    Element.hideWithAnimation(gameMessageShower, getBoardHeartX());

}

function showCountdownBoard(words){
//    Element.show(game_countdown_board, words);

    game_countdown_board.textContent = words;
    var scale_time = 50;
    var scale_interval = setInterval(
        function(){
            if(scale_time >= 150){
                clearInterval(scale_interval);
                hideCountdownBoard();
            }

            Element.setElementStyle(game_countdown_board, "transform", "scale("+ (scale_time/100).toString() +")");
            scale_time++;

        }
    );
}

function hideCountdownBoard(){
    Element.hide(game_countdown_board);
}

function showGameButton(words){
    Element.showWithScale(gameStateButton, "40%", words);
}

function hideGameButton(){
    Element.hideWithAnimation(gameStateButton, "40%");
}

function showGameResultBoard(){
    Element.show(gameResultBoard,"");
}

function hideGameResultBoard(){
    Element.hideWithAnimation(gameResultBoard, "30%");
}

function gameBeginningRestart(words){
    showMessageSoon(getBallX(), words);

    clearInterval(gameBeginningInterval);
    setTimeout(
        function(){
            gameBeginning();
        },
        2500);

}

