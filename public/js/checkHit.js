/**
 * Created by focinfi on 14-8-6.
 */

function checkGameState(){

    bossHeartY = ((blocks.margin_left + 5.5 * (BLOCk_WIDTH + BLOCK_MARGIN))/CANVAS_HEIGHT * 100).toString() + "%";

    var game_win = true;

    //check the array
    for(var i = 0; i < blocks.shape.length; i++)
        for(var j = 0; j < blocks.shape[i].length; j++)
            if(blocks.shape[i][j] != -1 && blocks.shape[i][j] != 0)
                game_win =false;



    if(ball.y >= CANVAS_HEIGHT - SUPER_BALL_R - 5){

        if(gameState == GAME_BEGINNING){
            gameBeginningRestart(BALL_DEAD_WARDS);

        }else{
//            ball.vy *= -1;
            gameOver(BALL_DEAD, BALL_DEAD_WARDS);
        }

    }else if(game_win){
        gameWin();
    }

    if((blocks.boss_shot && checkHitBossCannon())||
        (blocks.type == BOSS && checkHitBomb())){
            if(gameState == GAME_BEGINNING){
                gameBeginningRestart(BALL_DEAD_WARDS);
            }else{
                gameOver(BOARD_HEART_DEAD, BOARD_HEART_DEAD_WORDS);
            }
    }

}


function checkHitBlocks(){
    for(var i = 0; i < blocks.shape.length; i++)
        for(var j = 0; j < blocks.shape[i].length; j++)
            if(blocks.shape[i][j] != -1 && blocks.shape[i][j] != 0){
                if(ball.x >= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j &&
                    ball.x <= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH ){

                    if(ball.y <= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH + SUPER_BALL_R &&
                        ball.y >= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH + SUPER_BALL_R - BLOCk_WIDTH &&
                        ball.vy < 0){

                        ball.y = blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH + SUPER_BALL_R;
                        afterHitBlocks(i, j);
                        changeVelocityAfterHit(VY);

                    }else if(ball.y >= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i - SUPER_BALL_R &&
                        ball.y <= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i - SUPER_BALL_R + BLOCk_WIDTH&&
                        ball.vy > 0){

                        ball.y = blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i - SUPER_BALL_R;
                        afterHitBlocks(i, j);
                        changeVelocityAfterHit(VY);

                    }

                }else if(ball.y >= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i &&
                    ball.y <= blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH){
                    if(ball.x >= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j - SUPER_BALL_R &&
                        ball.x <= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j - SUPER_BALL_R + BLOCk_WIDTH &&
                        ball.vx > 0){

                        ball.x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j - SUPER_BALL_R;
                        afterHitBlocks(i, j);
                        changeVelocityAfterHit(VX);

                    } else if(ball.x <= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH + SUPER_BALL_R &&
                        ball.x >= blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + SUPER_BALL_R &&
                        ball.vx < 0){

                        ball.x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH + SUPER_BALL_R;
                        afterHitBlocks(i, j);
                        changeVelocityAfterHit(VX);

                    }
                }else if(ball.x > blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j -10 + 0.01 &&
                    ball.x < blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j &&
                    ball.y > blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i -10 + 0.01 &&
                    ball.y < blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i &&
                    (j == 0 || (blocks.shape[i][j - 1] == 0 || blocks.shape[i][j - 1] == -1)) &&
                    (i == 0 || (blocks.shape[i - 1][j] == 0 || blocks.shape[i - 1][j] == -1)) &&
                    ball.vx >= 0 && ball.vy >= 0){
                    if(blocks.vx < 0 && blocks.type == BOSS)
                        adjustBallPosition(II);

                    afterHitBlocks(i, j);
                    changeVelocityAfterHit(II);
                }else if(ball.x > blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH - 0.01 &&
                    ball.x < blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH + 10 &&
                    ball.y > blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i -10 + 0.01 &&
                    ball.y < blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i &&
                    (j == 10 || (blocks.shape[i][j + 1] == 0 || blocks.shape[i][j + 1] == -1)) &&
                    (i == 0 || (blocks.shape[i - 1][j] == 0 || blocks.shape[i - 1][j] == -1)) &&
                    ball.vx <= 0 && ball.vy >= 0){
                    if(blocks.vx > 0 && blocks.type == BOSS)
                        adjustBallPosition(I);

                    afterHitBlocks(i, j);
                    changeVelocityAfterHit(I);
                }else if(ball.x > blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j - 10 + 0.01 &&
                    ball.x < blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j &&
                    ball.y > blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH - 0.01 &&
                    ball.y < blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH + 10 &&
                    (j == 0 || (blocks.shape[i][j - 1] == 0 || blocks.shape[i][j - 1] == -1)) &&
                    (i == blocks.shape.length -1 || (blocks.shape[i + 1][j] == 0 || blocks.shape[i + 1][j] == -1)) &&
                    ball.vx >= 0 && ball.vy <= 0){
                    if(blocks.vx < 0 && blocks.type == BOSS)
                        adjustBallPosition(III);

                    afterHitBlocks(i, j);
                    changeVelocityAfterHit(III);
                }else if(ball.x > blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH - 0.01 &&
                    ball.x < blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j + BLOCk_WIDTH + 10 &&
                    ball.y > blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH - 0.01 &&
                    ball.y < blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i + BLOCk_WIDTH + 10 &&
                    (j == 10 || (blocks.shape[i][j + 1] == 0 || blocks.shape[i][j + 1] == -1)) &&
                    (i == blocks.shape.length -1 || (blocks.shape[i + 1][j] == 0 || blocks.shape[i + 1][j] == -1)) &&
                    ball.vx <= 0 && ball.vy <= 0){
                    if(blocks.vx > 0 && blocks.type == BOSS)
                        adjustBallPosition(V);

                    afterHitBlocks(i, j);
                    changeVelocityAfterHit(V);
                }

            }

//    checkHitBombs();
}

function checkHitBoard(){
    var board_normal_angel = Math.PI/2 - board.angle;
    var ball_in_angle = Math.atan(Math.abs(ball.vy)/Math.abs(ball.vx));
    var tmp_angle = Math.PI/2 - (ball_in_angle - board.angle);
    var ball_out_angle;
    var ball_out_angle_k;
    var ball_out_vx;
    var ball_out_vy;
    var ball_in_area;
    var ball_out_area;

    var hit_start_x;
    var hit_start_y;
    var hit_end_x;
    var hit_end_y;

    if(ball.vx >= 0){
        if(ball.vy >= 0)
            ball_in_area = II;
        else
            ball_in_area = III;
    }else{
        if(ball.vy >= 0)
            ball_in_area = I;
        else
            ball_in_area = V;
    }



    //from right to left when fix_point is in the left
    if(ball_in_area == I && board.fix_point == LEFT){

        if(ball_in_angle + 2 * tmp_angle <= Math.PI){
            ball_out_angle = Math.PI/2 - tmp_angle - board.angle;
            ball_out_area = II;
        }else{
            ball_out_angle = board.angle - (Math.PI/2 - tmp_angle);
            ball_out_area = III;
        }
//        gameDebugShower.textContent = ball_in_angle + "_1_" + tmp_angle;


    }else if(ball_in_area == II && board.fix_point == LEFT){//from left to right when fix_point is in the left
        if(ball_in_angle < board_normal_angel){

            tmp_angle = Math.PI/2 - ball_in_angle - board.angle;
            ball_out_angle = ball_in_angle + 2 * tmp_angle;

            if(ball_out_angle > Math.PI/2){
                ball_out_area = I;
            }else if(ball_out_angle = Math.PI/2){
                ball_out_angle -= 0.00001;
                ball_out_area = I;
            }else{
                ball_out_area = II;
            }
        }else if(ball_in_angle = board_normal_angel){
            ball_out_angle = Math.PI/4;
            ball_out_area = II;
        }else{
            tmp_angle = (ball_in_angle - board.angle) * 0.5;

            ball_out_angle = Math.PI - ball_in_angle - 2 * board.angle;
            ball_out_area = II;

        }
//        gameDebugShower.textContent = ball_in_angle + "_2_" + board_normal_angel;
    }else if(ball_in_area == I && board.fix_point == RIGHT){//from right to left when fix_point is in the right

        if(ball_in_angle < board_normal_angel){
            tmp_angle = board_normal_angel - ball_in_angle;
            ball_out_angle = ball_in_angle + tmp_angle * 2;

            if(ball_out_angle < Math.PI/2){
                ball_out_area = I;
            }else if(ball_out_angle == Math.PI/2){
                ball_out_angle -= 0.00001;
                ball_out_area = I;
            }else{
                ball_out_area = II;
            }

        }else if(ball_in_angle == board_normal_angel){
            ball_out_angle = ball_in_angle;
            ball_out_area = I;
        }else{
            tmp_angle = board.angle + ball_in_angle - Math.PI/2;
            ball_out_angle = board_normal_angel - tmp_angle;
            ball_out_area = I;
        }

//        gameDebugShower.textContent = ball_in_angle + "_3_" + ball_out_angle;


    }else if(ball_in_area == II && board.fix_point == RIGHT){//from left to right when fix_point is in the right
        tmp_angle = Math.PI/2 - (ball_in_angle - board.angle);

        if(ball_in_angle + 2 * tmp_angle < Math.PI){
            ball_out_angle = Math.PI - ball_in_angle - 2 * tmp_angle;
            ball_out_area = I;
        }else if(ball_out_angle = 0){
            ball_out_angle += 0.00001;
            ball_out_area = I;
        }else{
            ball_out_angle = board.angle - (Math.PI/2 - tmp_angle);
            ball_out_area = V;

        }
//        gameDebugShower.textContent = ball_in_angle + "_4_" + tmp_angle;

    }


    ball_out_angle_k = Math.abs(Math.tan(ball_out_angle));

    ball_out_vx = Math.sqrt((ball.vx * ball.vx + ball.vy * ball.vy) / (1 + ball_out_angle_k * ball_out_angle_k));

    ball_out_vy = ball_out_vx * ball_out_angle_k;


    switch(ball_out_area){
        case I:
            ball_out_vy *= -1;
            break;
        case II:
            ball_out_vx *= -1;
            ball_out_vy *= -1;
            break;
        case III:
            ball_out_vx *= -1;
            break;
        case V:
            break;
        default :
            break;
    }



    if(board.fix_point == LEFT){
        hit_end_x = getBoardX() - (SUPER_BALL_R + board.weight/2) * Math.sin(board.angle);
        hit_start_y = (getBoardY() - (board.weight/2 + SUPER_BALL_R) * Math.cos(board.angle)) + (hit_end_x - ball.x) * Math.tan(board.angle);
        hit_start_x = board.x - (SUPER_BALL_R + board.weight/2) * Math.cos(board.angle);
        hit_end_y = hit_start_y + board.weight * Math.cos(board.angle);

        hit_end_x += SUPER_BALL_R;
        hit_end_y += SUPER_BALL_R
    }else{
        hit_start_x = getBoardX() + (SUPER_BALL_R + board.weight/2)* Math.sin(board.angle);
        hit_start_y = (getBoardY() - (board.weight/2 + SUPER_BALL_R) * Math.cos(board.angle)) + (ball.x - hit_start_x) * Math.tan(board.angle);
        hit_end_x = boardEndX + (SUPER_BALL_R + board.weight/2) * Math.cos(board.angle);
        hit_end_y = hit_start_y + board.weight * Math.cos(board.angle);

        hit_start_x -= SUPER_BALL_R;
        hit_end_y += SUPER_BALL_R;
    }



    if(ball.x >= hit_start_x && ball.x <= hit_end_x){
        if(ball.y >= hit_start_y && ball.y <= hit_end_y){

            ball.vx = ball_out_vx;
            ball.vy = ball_out_vy;
            hitBoardMusic.play();

            //get the bug
            if(isNaN(ball.vx) || isNaN(ball.vy)){
                if(gameState == GAME_BEGINNING){
                    ball.vx = ball.vy = 0;
                    gameBeginningRestart(BUG_WORDS);
                }else{
                    bugNum++;
                    gameBug();
                }

                return;
            }

            return true;
        }
    }
    if(board.fix_point == LEFT){
        if(ball.x >= hit_end_x &&
            ball.x <= hit_end_x + (SUPER_BALL_R + board.weight) * Math.sin(board.angle) &&
            ball.y >= getBoardY() - board.weight/2 * Math.cos(board.angle) - SUPER_BALL_R &&
            ball.y <= getBoardY() + board.weight/2 * Math.cos(board.angle) + SUPER_BALL_R){

            changeVelocityAfterHit(VX_Y);

            hitBoardMusic.play();
            return true;

        }
    }
    if(board.fix_point == RIGHT){
        if(ball.x >=getBoardX() - SUPER_BALL_R - board.weight/2 * Math.sin(board.angle) &&
            ball.x <= getBoardX() + (SUPER_BALL_R + board.weight/2)* Math.sin(board.angle) &&
            ball.y >= getBoardY() - board.weight/2 * Math.cos(board.angle) - SUPER_BALL_R &&
            ball.y <= getBoardY() + board.weight/2 * Math.cos(board.angle) + SUPER_BALL_R){

            changeVelocityAfterHit(VX_Y);

            hitBoardMusic.play();

            return true;

        }
    }



}

function checkHitBossCannon(){
    for(var i = 0; i < bossCannonsArray.length; i ++){
        var cannon_block_i = bossCannonsArray[i][0];
        var cannon_block_j = bossCannonsArray[i][1];
        if(blocks.shape[cannon_block_i][cannon_block_j] == 3 && cannon.length >= board.y){
            var start_x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * cannon_block_j;
            var end_x = start_x + BLOCk_WIDTH;

            if((!(board.x + board.weight <= start_x || board.x - board.weight >= end_x) && board.fix_point == LEFT) ||
                (!(board.x + board.width + board.weight <= start_x || board.x + board.width - board.weight >= end_x) && board.fix_point == RIGHT))
                return true;
        }
    }



}

function checkHitBomb(){
    //check hit bomb
    for(var i = 0; i < bombs.length; i++){
        if((board.x >= bombs[i].x - board.weight && board.x <= bombs[i].x + BLOCk_WIDTH + board.weight && bombs[i].y >= board.y - BLOCk_WIDTH - board.weight && bombs[i].y <= board.y && board.fix_point == LEFT) ||
            (board.x + board.width >= bombs[i].x - board.weight && board.x + board.width <= bombs[i].x + BLOCk_WIDTH + board.weight && bombs[i].y >= board.y - BLOCk_WIDTH - board.weight && bombs[i].y <= board.y && board.fix_point == RIGHT))
            return true;
    }

    return false;
}


function checkHitBorder(){
    if(ball.y <= SUPER_BALL_R){
        ball.y = SUPER_BALL_R;
        ball.vy *= -1;
    }

    if(ball.x >=CANVAS_HEIGHT - SUPER_BALL_R){
        ball.x = CANVAS_HEIGHT - SUPER_BALL_R;
        ball.vx *= -1;
    }

    if(ball.x <= SUPER_BALL_R){
        ball.x = SUPER_BALL_R;
        ball.vx *= -1;
    }

    if(board.x >= CANVAS_HEIGHT){
        board.x = CANVAS_HEIGHT;
        board.vx *= -1;
    }

    if(blocks.margin_left <= 0){
        blocks.margin_left = 0;
        blocks.vx *= -1;
    }

    if(blocks.margin_left >= CANVAS_HEIGHT - (BLOCk_WIDTH + BLOCK_MARGIN) * blocks.shape[0].length){
        blocks.margin_left = CANVAS_HEIGHT - (BLOCk_WIDTH + BLOCK_MARGIN) * blocks.shape[0].length;
        blocks.vx *= -1;
    }

}