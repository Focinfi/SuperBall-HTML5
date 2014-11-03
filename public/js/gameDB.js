/**
 * Created by focinfi on 14-8-8.
 */
superBallDB = openDatabase("super_ball_db", "1.0", "game_score_table", 1024 * 1024 * 5);
superBallDB.transaction(function (tx) {

    tx.executeSql(
        "create table if not exists game_score_table (id REAL UNIQUE, date TEXT, best_game_time TEXT, best_hit_num TEXT)",
        [],
        function () {
        },
        function (tx, error) {
        });
});

superBallDB.transaction(function (tx) {

    tx.executeSql(
        "create table if not exists game_bug_table (id REAL UNIQUE, date TEXT, bug_num TEXT)",
        [],
        function () {
        },
        function (tx, error) {
        });
});

var gameScoreFunction = {};

gameScoreFunction.game_score_functions = function(){
    var _this = this;
    this.insert = function() {
        var id = Math.random();
        var date = new Date().toString();
        nowGameTime = gameTime;

        if(bestGameTime == null || (bestGameTime != null && bestGameTime > gameTime)){
            bestGameTime = gameTime;
            newRecord = true;
        }


        if(bestHitBlocksNum < hitBlocksNum){
            bestHitBlocksNum = hitBlocksNum;
            newRecord = true;
        }

        superBallDB.transaction(function(tx) {
            tx.executeSql(
                "insert into game_score_table (id, date, best_game_time, best_hit_num) values(?, ?, ?, ?)",
                [id, date, bestGameTime, bestHitBlocksNum],
                function () {

                },
                function (tx, error) {
                    console.log(error);
                });
        });
    }

    this.query = function() {
        superBallDB.transaction(function(tx){
            tx.executeSql(
                "select * from game_score_table",[],
                function(tx, result){
                    if(result.rows.length == 0){
                        bestGameTime = null;
                        bestHitBlocksNum = 0;
                    }else{
                        bestGameTime = result.rows.item(result.rows.length - 1)['best_game_time'];
                        bestHitBlocksNum = result.rows.item(result.rows.length - 1)['best_hit_num'];
                    }
                },
                function (tx, error) {

                });

        });
    }

}

var gameBugFunction = {};
gameBugFunction.game_bug_functions = function(){
    var _this = this;
    this.insert = function() {
        var id = Math.random();
        var date = new Date().toString();

        superBallDB.transaction(function(tx) {
            tx.executeSql(
                "insert into game_bug_table (id, date, bug_num) values(?, ?, ?)",
                [id, date, bugNum],
                function () {

                },
                function (tx, error) {
                    console.log(error);
                });
        });
    }

    this.query = function() {
        superBallDB.transaction(function(tx){
            tx.executeSql(
                "select * from game_bug_table",[],
                function(tx, result){
                    if(result.rows.length == 0){
                        bugNum = 0;
                    }else{
                        bugNum = parseInt(result.rows.item(result.rows.length - 1)['bug_num']);
                    }
                },
                function (tx, error) {

                });

        });
    }
}
