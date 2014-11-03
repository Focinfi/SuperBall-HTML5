/**
 * Created by mac on 14-8-1.
 */

function updateBlocks(){
//    gameDebugShower.textContent = countCannonTime.toString() + blocks.boss_shot;

    if(blocks.type == BOSS){
        blocks.margin_left += blocks.vx;
        countCannonTime++ ;

        updateBoss();


        if(countCannonTime % 1000 >= 500 && countCannonTime % 1000 <= 999){
            blocks.boss_shot = true;
        }else{
            blocks.boss_shot = false;
        }
    }
}


function updateSuperBall(){
    ball.x += ball.vx * 0.1;
    ball.y += ball.vy * 0.1;

//    gameDebugShower.textContent = ball.x + "_" + ball.vx;

    if(countSpeedUp >0){
        countSpeedUp--;

    }

    if(countSpeedUp == 0 && ball.speed_up){
        ball.speed_up = false;

        ball.vx /= BALL_SPEED_UP_TIMES;
        ball.vy /= BALL_SPEED_UP_TIMES;
    }

    //update skill q/w x
    if(ball.y > CANVAS_HEIGHT/2 && ball.vy > 0){
        if(getBallPointOfFall() <= CANVAS_HEIGHT/2)
            skillQX = getBallPointOfFall();
        else
            skillWX = getBallPointOfFall();
    }

    if(skillQX <= 0)
        skillQX = 0;

    if(skillWX >= CANVAS_HEIGHT)
        skillWX = CANVAS_HEIGHT;

    setCss(skillLightQ, "left", ((skillQX - 8)/CANVAS_HEIGHT * 100).toString() + "%");
    setCss(skillLightW, "left", ((skillWX - 8)/CANVAS_HEIGHT * 100).toString() + "%");





}

function updateBoss(){

    var tmp_array = new Array();;
    for (var i = 0; i < blocks.shape.length; i++) {
        tmp_array[i] = new Array();
        for (var j = 0; j < blocks.shape[i].length; j++)
            tmp_array[i][j] = -1;
    }

    //boss legs move
//    gameDebugShower.textContent = gameState;
    if(countCannonTime % BOSS_MOVE_INTERVAL == BOSS_MOVE_INTERVAL - 1){
        if(bossLeftOffsetDirection == RIGHT){
            //move left leg to right
            for(var i = bossCannonsArray[0][0] - 1; i < blocks.shape.length; i++){
                for(var j = bossCannonsArray[0][1] + 2; j >= bossCannonsArray[0][1] - 1; j--){
                    if(j - 1 >= 0)
                        tmp_array[i][j] = blocks.shape[i][j -1];
                }
            }
            //move right leg to left
            for(var i = bossCannonsArray[0][0] - 1; i < blocks.shape.length; i++){
                for(var j = bossCannonsArray[1][1] - 2; j <= bossCannonsArray[1][1] + 1; j++){
                    if(j - 1 <= blocks.shape[0].length - 1)
                        tmp_array[i][j - 1] = blocks.shape[i][j];
                }
            }


            //change the tate of boss moving
            bossOffset++;
            if(bossOffset > 2){
                bossOffset = -1;
                bossLeftOffsetDirection = LEFT;
            }
//            gameDebugShower.textContent = "01_" + blocks.shape[6][10];
            bossCannonsArray[0][1]++;
            bossCannonsArray[1][1]--;

        }else if(bossLeftOffsetDirection == LEFT){

            //move left leg to right
            for(var i = bossCannonsArray[0][0] - 1; i < blocks.shape.length; i++){
                for(var j = bossCannonsArray[0][1] - 2; j <= bossCannonsArray[0][1] + 1; j++){
                    tmp_array[i][j - 1] = blocks.shape[i][j];
                }
            }
            //move right leg to left
            for(var i = bossCannonsArray[0][0] - 1; i < blocks.shape.length; i++){
                for(var j = bossCannonsArray[1][1] + 2; j >= bossCannonsArray[1][1] - 1; j--){
                    tmp_array[i][j] = blocks.shape[i][j - 1];
                }
            }

            //change the tate of boss moving
            bossOffset--;
            if(bossOffset < -2){
                bossOffset = 1;
                bossLeftOffsetDirection = RIGHT;
            }
//            gameDebugShower.textContent = "02_" + bossOffset;
            bossCannonsArray[0][1]--;
            bossCannonsArray[1][1]++;
        }


        //reset array
        for(var i = bossCannonsArray[0][0] - 1; i < blocks.shape.length; i++){
            for(var j = 0; j < blocks.shape[0].length; j++){
                blocks.shape[i][j] = tmp_array[i][j];
            }
        }

    }

    //boss bombs
    updateBomb();
}



function updateLaser(init_x, init_y){

    for(var m = 0; m < lasers.length ; m++){
        if(lasers[m].direction == LEFT)
            lasers[m].x = init_x - 0.25 * BLOCk_WIDTH;
        else
            lasers[m].x = init_x + 0.25 * BLOCk_WIDTH;

        lasers[m].y = init_y;

        lasers[m].x += lasers[m].offset;
        lasers[m].offset += lasers[m].vx * 0.02;

        if(lasers[m].offset >= BLOCk_WIDTH/4 && lasers[m].direction == RIGHT){
            lasers[m].offset = BLOCk_WIDTH/4;
            lasers[m].vx *= -1;
        }

        if(lasers[m].offset <= -1 * BLOCk_WIDTH/4 && lasers[m].direction == LEFT){
            lasers[m].offset = -1 * BLOCk_WIDTH/4;
            lasers[m].vx *= -1;
        }

        if(lasers[m].offset >= 0 && lasers[m].direction == LEFT){
            lasers[m].offset = 0;
            lasers[m].vx *= -1;
        }

        if(lasers[m].offset <= 0 && lasers[m].direction == RIGHT){
            lasers[m].offset = 0;
            lasers[m].vx *= -1;
        }
    }
}

function updateBomb(){
    var content_bomb_index = 0;
    for(var i = 0; i < bombs.length; i++){
        bombs[i].y += bombs[i].vy;
        if(bombs[i].y <= CANVAS_HEIGHT)
            bombs[content_bomb_index++] = bombs[i];
    }

    //clear the instance out of content window
    while(bombs.length > content_bomb_index){
        bombs.pop();
    }
}

function updateWater(){
    if(gameTime%2 == 0)
        for(var i = 0; i < waters.length; i++){
            waters[i].y_top += waters[i].v * 2;
            if(waters[i].y_top <= CANVAS_HEIGHT - 10 + 0.5){
                waters[i].y_top = CANVAS_HEIGHT - 10 + 0.5;
                waters[i].v *= -1;
            }

            if(waters[i].y_top >= CANVAS_HEIGHT - 10 + 4.5){
                waters[i].y_top = CANVAS_HEIGHT - 10 + 4.5;
                waters[i].v *= -1;
            }
        }
}

function updateBoard(){
    var skills_f = document.getElementById("skills_f_cooling");

    if(board.x <= 0 && board.fix_point == LEFT){
        board.x = 0 ;
    }else if(getBoardX() <= 0 && board.fix_point == RIGHT){
        board.x = -1 * (board.width - board.width * Math.cos(board.angle));
    }

    if(board.x >= CANVAS_HEIGHT - board.width * Math.cos(board.angle) && board.fix_point == LEFT)
        board.x = CANVAS_HEIGHT - board.width * Math.cos(board.angle);
    else if(getBoardX() + board.width * Math.cos(board.angle) >= CANVAS_HEIGHT && board.fix_point == RIGHT){
        board.x = CANVAS_HEIGHT - board.width;
        boardEndX = getBoardX() + board.width * Math.cos(board.angle);
    }

    if(board.angle >= Math.PI/4)
        board.angle = Math.PI/4;

    if(board.angle <= 0)
        board.angle = 0;


    //update double_length

    //first time to play
    if(!double_board_length && doubleBoardLengthAvailable){
        skills_f.className = "";
        skills_f.textContent = "";

    }

    //hit the "F"
    if(double_board_length){
        doubleBoardLengthAvailable = false;

        countDoubleBoardLength --;

        if(countDoubleBoardLength == 0){
            double_board_length = false;
            countDoubleBoardLength = 1000;
            return;
        }


        if(countDoubleBoardLength < 100){
            board.width -= board.width / countDoubleBoardLength;
            if(board.width <= board_now_width)
                board.width = board_now_width;
        }
    }

//    gameDebugShower.textContent = board.width + "__" + board_now_width;

    //after the effecting of double-length to act the cooling countdown
    if(!double_board_length && !doubleBoardLengthAvailable){

        countDoubleBoardLength --;

        skills_f.className = "skills_cooling";
        skills_f.textContent = parseInt(countDoubleBoardLength/100);

        if(countDoubleBoardLength == 0){
            doubleBoardLengthAvailable = true;
            skills_f.className = "";
            skills_f.textContent = "";
        }

    }

    board.width -= board.width * 0.000133333;
    if(board.width <= SUPER_BALL_R * 2)
        board.width = SUPER_BALL_R * 2;

    if(!double_board_length)
        board_now_width = board.width;

}

function updateBossBody(){
    for(var i = 0; i < bossBodyArray.length; i++){
        if(bossBodyArray[i].level <= parseInt(15 - countdownStartNum/20)){
            if((bossBodyArray[i].form_left < bossBodyArray[i].to_left && bossBodyArray[i].direction == LEFT) ||
                (bossBodyArray[i].form_left > bossBodyArray[i].to_left && bossBodyArray[i].direction == RIGHT)){

                bossBodyArray[i].form_left += bossBodyArray[i].vx;
                bossBodyArray[i].vx *= bossBodyArray[i].a;

            }else if((bossBodyArray[i].form_top > bossBodyArray[i].to_top && bossBodyArray[i].direction == BOTTOM) ||
                (bossBodyArray[i].form_top < bossBodyArray[i].to_top && bossBodyArray[i].direction == TOP)){

                bossBodyArray[i].form_top += bossBodyArray[i].vy;
                bossBodyArray[i].vy *= bossBodyArray[i].a;
            }


            if((bossBodyArray[i].form_left > bossBodyArray[i].to_left && bossBodyArray[i].direction == LEFT) ||
                (bossBodyArray[i].form_left < bossBodyArray[i].to_left && bossBodyArray[i].direction == RIGHT)){

                bossBodyArray[i].form_left = bossBodyArray[i].to_left;
                hitBoardMusic.play();

            }else if((bossBodyArray[i].form_top < bossBodyArray[i].to_top && bossBodyArray[i].direction == BOTTOM) ||
                (bossBodyArray[i].form_top > bossBodyArray[i].to_top && bossBodyArray[i].direction == TOP)){

                bossBodyArray[i].form_top = bossBodyArray[i].to_top;
                hitBoardMusic.play();

            }
        }
    }
}

function updateBossPiece(win_start_num){
    var content_num = 0;

    if(win_start_num <= 100){
        for(var i = 0; i < bossPieces.length; i++){
            if(win_start_num%2 == 0){
                bossPieces[i].x += Math.random() * 0.3;
                bossPieces[i].y += Math.random() * 0.3;
            }else{
                bossPieces[i].x -= Math.random() * 0.3;
                bossPieces[i].y -= Math.random() * 0.3;
            }
        }
        return;
    }

    for(var i = 0; i < bossPieces.length; i++){
        bossPieces[i].x += bossPieces[i].vx * 1;
        bossPieces[i].y += bossPieces[i].vy * 0.1;
        bossPieces[i].vy += bossPieces[i].a * 0.1;

        if(bossPieces[i].x >= 0 - BLOCk_WIDTH && bossPieces[i].x <= CANVAS_HEIGHT && bossPieces[i].y <= CANVAS_HEIGHT)
            bossPieces[content_num++] = bossPieces[i];
    }

    while(bossPieces.length > content_num)
        bossPieces.pop();
}

function updateScore(){
    if(gameTime >= 100)
        nowTimeBoard.textContent = "Time: " + parseInt(gameTime/100/60) + "'" + parseInt(gameTime/100%60) + "''";

    nowHitBlocksBoard.textContent = "Hit: " + hitBlocksNum;
    bugBoard.textContent = "Bug: " + bugNum;
}

//UI animation update
function updateStateButtonRotation(countdown_num){
    if(countdown_num%300 >= 0 && countdown_num%300 <= 80){
        if(countdown_num%10 == 0)
            Element.setElementStyle(gameStateButton, "transform", "rotate(3deg)");
        if(countdown_num%11 == 0)
            Element.setElementStyle(gameStateButton, "transform", "rotate(-3deg)");
        if(countdown_num%300 == 80)
            Element.setElementStyle(gameStateButton, "transform", "rotate(0)");

    }
}

function updateCountdownAnimation(countdown_start_num){
    if(countdown_start_num >= 0){
        setCss(contentLeftBoard, "left", (-1 * (35.5 - countdown_start_num/10)).toString() + "%");
        setCss(contentRightBoard, "left", (100 - countdown_start_num/10).toString() +"%");
    }

}

function updateScoreShowerAnimation(win_start_num){

    setGameResultData();


    setCss(lightRotation, "transform", "scale("+ (2 + (500 - Math.abs(500 - win_start_num%1000))/1000).toString()+") rotate(" + win_start_num + "deg)");

    if(win_start_num >= 300 && win_start_num <= 340){
        scoreShowerLeft += 2;

        if(scoreShowerLeft >= 30)
            scoreShowerLeft = 30;

        if(win_start_num > 315 && win_start_num <= 330)
            scoreShowerSkew -= 2;
        else if(win_start_num > 330)
            scoreShowerSkew +=1;

        var style = "visibility: visible;left:" + scoreShowerLeft + "%;";
        Element.setElementStyle(gameResultBoard, style + "transform", "skew("+ scoreShowerSkew +"deg)");
    }else if(win_start_num >= 340){
        var style = "visibility: visible;left:" + scoreShowerLeft + "%;";
        Element.setElementStyle(gameResultBoard, style + "transform", "skew("+ scoreShowerSkew +"deg)");

    }
}













