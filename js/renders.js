/**
 * Created by focinfi on 14-8-1.
 */


function renderBall(context){
    context.beginPath();
    context.arc(ball.x, ball.y, SUPER_BALL_R, 0, 2*Math.PI);
    context.fillStyle = "red";
    context.closePath();
    context.fill();
}

function renderBoard(context){
    boardHeartX = 0;
    boardStartX = board.x;
    boardStartY = board.y - board.weight/2;

    boardEndX = board.x + board.width;
    boardEndY = boardStartY;

    if(board.fix_point == LEFT){
        boardHeartX = board.x ;
        boardEndX = getBoardX();
        boardEndY =  getBoardY();

    }else{
        boardHeartX = board.x + board.width;
        boardStartX = getBoardX();
        boardStartY = getBoardY();

    }

    context.beginPath();
    context.moveTo(boardStartX, boardStartY);
    context.lineTo(boardEndX, boardEndY);
    context.lineWidth = board.weight;
    context.strokeStyle = board.color;
    context.stroke();
    context.closePath();

    context.beginPath();
    context.arc(boardHeartX, board.y - board.weight/2, board.weight + gameTime/20%6, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(boardHeartX, board.y - board.weight/2, board.weight + 1, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.closePath();
    context.fill();


    //render q/w skill x

    context.beginPath();
    context.arc(skillQX, board.y - board.weight/2, gameTime/20%6, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.closePath();
    context.stroke();

    context.beginPath();
    context.arc(skillWX, board.y - board.weight/2, gameTime/20%6, 0, 2 * Math.PI);
    context.lineWidth = 1;
    context.strokeStyle = "red";
    context.closePath();
    context.stroke();

}


function renderBlocks(context){
    for(var i = 0; i < blocks.shape.length; i++)
        for(var j = 0; j < blocks.shape[i].length; j++){

         if(blocks.shape[i][j] != -1){
            context.beginPath();
            context.rect(blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * j,
                blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i,
                BLOCk_WIDTH, BLOCk_WIDTH)
            context.lineWidth = 2;
            context.strokeStyle = colors[0];
            context.fillStyle = getBlockColor(blocks.shape[i][j]);
            context.stroke();
            context.fill();
            context.closePath();
         }

        }

    if(blocks.type == BOSS){
        //render bombs
        for(var m = 0; m < bombs.length; m++){
            context.beginPath();
            context.rect(bombs[m].x, bombs[m].y, BLOCk_WIDTH, BLOCk_WIDTH);
            context.lineWidth = 2;
            context.strokeStyle = colors[0];
            context.fillStyle = colors[m];
            context.stroke();
            context.fill();
            context.closePath();
        }

    }

    if(blocks.boss_shot)
        renderBossCannon(context);

}

function renderBossCannon(context){

    for(var i = 0; i < bossCannonsArray.length; i ++){
        var cannon_block_i = bossCannonsArray[i][0];
        var cannon_block_j = bossCannonsArray[i][1];

        if(blocks.shape[cannon_block_i][cannon_block_j] == 3){

            cannon.x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * cannon_block_j;
            cannon.y = blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * (cannon_block_i + 1) - BLOCK_MARGIN;
            cannon.length = cannon.y + countCannonTime % 1000 - 500;


            if(parseInt(countCannonTime/1000%3) == 0){
                cannon.length = 0;
//                gameDebugShower.textContent = cannon.length;
                addBombs();


            }else if(parseInt(countCannonTime/1000%3) == 1){
                initLighting();

                cannon.x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * cannon_block_j;
                cannon.y = blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * (cannon_block_i + 1) - BLOCK_MARGIN;
                cannon.length = cannon.y + countCannonTime % 1000 - 500;

                context.beginPath();
                context.moveTo(cannon.x + 0.5 * BLOCk_WIDTH, cannon.y);
                context.lineTo(cannon.x + 0.5 * BLOCk_WIDTH, cannon.y + countCannonTime % 1000 - 500);
                context.lineWidth = BLOCk_WIDTH/2;
                context.strokeStyle = colors[2];
                context.stroke();
                context.closePath();

                context.beginPath();
                context.arc(cannon.x + 0.5 * BLOCk_WIDTH, cannon.y + countCannonTime % 1000 - 500, BLOCk_WIDTH/4, 0, Math.PI * 2);
                context.fillStyle = colors[2];
                context.closePath();
                context.fill();


                for(var m = 0; m < lightingArray.length; m++){
                    context.beginPath();
                    context.moveTo(lightingArray[m].x , lightingArray[m].y);
                    for(var j = 1; j < lightingArray[m].node_array.length; j++){
                        context.lineTo(lightingArray[m].node_array[j][0], lightingArray[m].node_array[j][1]);
                    }
                    context.lineWidth = 1;
                    context.strokeStyle = "yellow";
                    context.stroke();
                    context.closePath();

                }
            }else{

                initLasers();

                cannon.x = blocks.margin_left + (BLOCk_WIDTH + BLOCK_MARGIN) * cannon_block_j + 0.5 * BLOCk_WIDTH;
                cannon.y = blocks.margin_top + (BLOCk_WIDTH + BLOCK_MARGIN) * (cannon_block_i + 1) - BLOCK_MARGIN;
                cannon.length = cannon.y + countCannonTime % 1000 - 500;

                context.beginPath();
                context.moveTo(cannon.x, cannon.y);
                context.lineTo(cannon.x, cannon.y + countCannonTime % 1000 - 500);
                context.lineWidth = BLOCk_WIDTH/2;
                context.strokeStyle = colors[2];
                context.stroke();
                context.closePath();

                context.beginPath();
                context.arc(cannon.x , cannon.y + countCannonTime % 1000 - 500, BLOCk_WIDTH/4, 0, Math.PI * 2);
                context.fillStyle = colors[2];
                context.closePath();
                context.fill();

                updateLaser(cannon.x, cannon.y);

                for(var m = 0; m < lasers.length ; m++){

                    context.beginPath();
                    context.moveTo(lasers[m].x, lasers[m].y);
                    context.lineTo(lasers[m].x, lasers[m].y +  countCannonTime % 1000 - 500 + BLOCk_WIDTH/4 - Math.abs(m/2)*2 - 2);
                    context.lineWidth = 1;
                    context.strokeStyle = "red";
                    context.stroke();
                    context.closePath();
                }
            }
        }
    }
}


function renderWater(context){
    if(waters.length < 50)
        initWater();

//    gameDebugShower.textContent = waters[2].y_top;

    for(var i = 0; i < waters.length; i++){
        context.beginPath();
        context.moveTo(waters[i].x_bottom, waters[i].y_bottom);
        context.lineTo(waters[i].x_top, waters[i].y_top);
        context.lineWidth = CANVAS_HEIGHT/50;
        context.strokeStyle = waters[i].color;
        context.closePath();
        context.stroke();
    }
}


function renderBossBody(context, a_body){
    for(var i = 0; i < a_body.blocks.length; i++)
        for(var j = 0; j < a_body.blocks[i].length; j++){
            if(a_body.blocks[i][j] != -1){
                context.beginPath();
                context.rect(a_body.form_left + (BLOCk_WIDTH + BLOCK_MARGIN +0.5) * j,
                    a_body.form_top + (BLOCk_WIDTH + BLOCK_MARGIN) * i,
                    BLOCk_WIDTH, BLOCk_WIDTH)
                context.lineWidth = 2;
                context.strokeStyle = colors[0];
                context.fillStyle = getBlockColor(a_body.blocks[i][j]);
                context.stroke();
                context.fill();
                context.closePath();
            }

        }
}


function renderBossPiece(context){
    for(var i = 0; i < bossPieces.length; i++){
        if(bossPieces[i].color_number != -1){
            context.beginPath();
            context.rect(bossPieces[i].x,
                bossPieces[i].y,
                BLOCk_WIDTH, BLOCk_WIDTH)
            context.lineWidth = 2;
            context.strokeStyle = colors[0];
            context.fillStyle = getBlockColor(bossPieces[i].color_number);
            context.stroke();
            context.fill();
            context.closePath();
        }
    }
}