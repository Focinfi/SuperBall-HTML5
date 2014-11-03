/**
 * Created by focinfi on 14-7-28.
 */



var colors = ["grey", "orange", "blue", "red", "green", "yellow", "lightblue", "brown", "black", "purple"];

var BLOCK_COLORS = ["grey", "orange", "blue", "purple", "green"];

var SHAPES =
    [
        [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
            [2, 2, 3, 3, 2, 3, 3, 3, 3, 3, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1]
        ], 

        [
            [-1,-1,-1,-1,-1,-1,-1,-1, 1, 1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
            [-1,-1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 2, 1, 1, 1, 1, 1,-1,-1],
            [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [-1,-1, 1, 1, 1, 1, 3, 3, 3, 3, 1, 1, 2, 1, 1, 1, 1, 1,-1,-1],
            [-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1, 1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1, 1, 1, 1,-1,-1,-1,-1,-1,-1,-1,-1,-1]

        ],

        [
            [-1,-1,-2,-1,-1,-1,-1,-1,-2,-1,-1],
            [-1,-1,-2, 2, 1,-1, 1, 2,-2,-1,-1],
            [-1,-1,-2, 2, 1,-3, 1, 2,-2,-1,-1],
            [-1, 2, 1, 2,-2,-2,-2, 2, 1, 2,-1],
            [-1, 2, 1, 2,-1,-1,-1, 2, 1, 2,-1],
            [-1,-1,-2,-1,-1,-1,-1,-1,-2,-1,-1],
            [-1, 1, 3, 1,-1,-1,-1, 1, 3, 1,-1],
            [-1,-2,-1,-2,-1,-1,-1,-2,-1,-2,-1]
        ],

        [
            [-1,-1,-2,-1,-1,-1,-1,-1,-2,-1,-1],
            [-1,-1,-2, 2, 1,-1, 1, 2,-2,-1,-1],
            [-1,-1,-2, 2, 1,-3, 1, 2,-2,-1,-1],
            [-1, 2, 1, 2,-2,-2,-2, 2, 1, 2,-1],
            [-1, 2, 1, 2,-1,-1,-1, 2, 1, 2,-1],
            [-1,-2,-1,-1,-1,-1,-1,-1,-1,-2,-1],
            [-1, 3,-1,-1,-1,-1,-1,-1,-1, 3,-1]

        ]
    ]

BOSSES_CANNONS_ARRAYS =
    [
        [
            [6, 2],
            [6, 8]
        ]
    ];

//develop mode
var developMode = DEBUG;
var DEBUG = 0, PLAY = 1;

//game database functions
var scoreDBFunctions;
var bugDBFunctions;

//game UI elements
    //game shower
    var gameMessageShower,
        gameStateButton,
        contentLeftBoard,
        contentRightBoard,
        gameScoreShower,
        gameResultBoard,
        gameBossDialog;
    var scoreShowerLeft = 0,
        scoreShowerSkew = 20;
    var skillLightQ,
        skillLightW;
    var gameButtonLock = true;
    //debug shower
    var game_debug_shower;
    //game score board
    var gameBestTimeBoard;
    var gameBestHitNumBoard;
    var nowTimeBoard;
    var nowHitBlocksBoard ;
    var bugBoard;
    var gameBackgroundMusic,
        hitBoardMusic,
        hitBlockMusic,
        bombMusic,
        gameOverMusic,
        gameWinMusic,
        gameBugMusic;

    var lightRotation;


//game state
    var GAME_BEGINNING = 0, GAME_START = 1, GAME_PAUSE = 2, GAME_RESUME = 3, GAME_OVER = 4, GAME_WIN = 5, GAME_DEBUG = 6;

//game configuration
    //music
    var music_on = true;
    //beginning
    var countdownStartNum = 355;
    //canvas
    var CANVAS_HEIGHT = 500;
    var CANVAS_PADDING = 30;
    //ball
    var SUPER_BALL_R = 10   ;
    var BALL_X = CANVAS_HEIGHT/2;
    var BALL_Y = CANVAS_HEIGHT * 0.7;
    var BALL_VX = -20;
    var BALL_VY = -20;
    var BALL_SPEED_UP_TIMES = 1.7;
    //blocks
    var BLOCK_MARGIN = 3;
    var BLOCk_WIDTH = SUPER_BALL_R * 2;
    var BLOCK_MARGIN_LEFT = 125;
    var BOARD_X = CANVAS_HEIGHT * 0.4;
    var BOARD_WIDTH = 80;
    var DOUBLE_BOARD_LENGTH_TIME = 500;
    var DOUBLE_BOARD_LENGTH_COOLING_TIME = 1000;
    //boss
    var CANNON_SHOT_TIME = 500;
    var BOSS_MOVE_INTERVAL = 100;
    //game over type
    var BALL_DEAD = 0, BOARD_HEART_DEAD = 1;
    var BALL_DEAD_WARDS = "I am DEAD man";
    var BOARD_HEART_DEAD_WORDS = "Heartbroken";
    var BUG_WORDS = "You got A BUG";

//game symbol
    var VX = 0, VY = 1, VX_Y=3;
    var LEFT = 0, RIGHT = 1, TOP = 2, BOTTOM = 3;
    var I = 1, II = 2, III = 3, V =4;
    var STATIC = 0, BOSS = 1, DEAD = 3;
    var KEYBOARD_AVAILABLE = true;

//game runtime variables
    var newRecord =false;
    var nowGameTime = 0;

    var gameRuntimeInterval,
        gameBeginningInterval,
        gameBeginningAnimationInterval,
        gameStartInterval,
        gameResumeInterval,
        gameBossAnimationInterval,
        gameWinAnimationInterval;
    var canvas;
    var canvasContext;
    var gameState = GAME_OVER;
    var bestHitBlocksNum= 0;
    var bestGameTime = null;
    var hitBlocksNum = 0;
    var bugNum = 0;
    var gameTime = 0;
    //ball
    var countSpeedUp = 0;
    var skillQX = 0;
    var skillWX = CANVAS_HEIGHT;
    //board
    var board_now_width = BOARD_WIDTH;
    var doubleBoardLengthAvailable = true;
    var double_board_length = false;
    var countDoubleBoardLength = 0;
    var boardStartX = 0, boardEndX = 0, boardStartY = 0, boardEndX = 0;
    var boardHeartX;

    //boss
    var bossShape = deepCopyArray(SHAPES[3]);
    var bossCannonsArray = deepCopyArray(BOSSES_CANNONS_ARRAYS[0]);
    var bossPieces = [];
    var bossBodyArray = [];
    var waters= [];
    var lasers = [];
    var lightingArray = [];
    var bombs = [];
    var countCannonTime = 0;
    var bossOffset = 2;
    var bossLeftOffsetDirection = RIGHT;
    var bossHeartX,
        bossHeartY;

//game class
    var ball = {x : BALL_X, y : BALL_Y, a : 2, vx : BALL_VX, vy : BALL_VY, color : colors[4], speed_up : false};
    var board = {x : BOARD_X, y : CANVAS_HEIGHT - 10, width : board_now_width, weight : 4, angle: 0, fix_point : LEFT, height : 5, vx : 10, color : colors[0], board_heart_x:boardHeartX}
    var blocks = {margin_left : BLOCK_MARGIN_LEFT, margin_top : CANVAS_PADDING, vx : 0.1, vy : 5, a : 2, type : BOSS, shape : bossShape, boss_num : 0, boss_cannon_time : 0, boss_shot : false}
    var cannon = {x : 0, y : 0, length : 0, offset : 0, vx : -1, vy : 1, a : 1, direction : LEFT, shot_time : 0}



//deepCopy
function deepCopyArray(array){
    var copy = [], i = 0, array_length = array.length;
    for(; i < array_length; i++){
        if(array[i] instanceof Array)
            copy[i] = deepCopyArray(array[i]);
        else
            copy[i] = array[i];
    }

    return copy;
}