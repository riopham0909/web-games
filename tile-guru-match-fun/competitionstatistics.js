/**
 * Created by andrey on 18.09.19.
 */

var CompetitionStatistics = function () { 
    this.load();
};

CompetitionStatistics.prototype.onGameStop = function (game) {
    if (cleverapps.config.type === "board" && game.outcome !== GameBase.OUTCOME_UNKNOWN) {
        var oneWordOpenTime = Math.floor(game.timer.getTime() / game.board.countTotalWords() / 1000);
        this.saveBoardGameWordOpenByKeypadLengthTime(game.keypad.amountKeys(), oneWordOpenTime);
    }
};

CompetitionStatistics.prototype._newData = function (type, value) {
    if (this.data[type] && this._isAppropriateValue(type, value)) {
        this.data[type] = Math.round(this.data[type] * 0.9 + value * 0.1);
        this.save();
    }
};

CompetitionStatistics.prototype._isAppropriateValue = function (type, value) {
    return value > CompetitionStatistics.DEFAULTS[type] / 5 && value < CompetitionStatistics.DEFAULTS[type] * 5;
};

CompetitionStatistics.prototype.saveBoardGameWordOpenByKeypadLengthTime = function (keypadLength, time) {
    this._newData("brd_l" + keypadLength, time);
};

CompetitionStatistics.prototype.getBoardGameWordOpenByKeypadLengthTime = function (keypadLength) {
    keypadLength = Math.min(Math.max(keypadLength, 4), 9);
    return this.data["brd_l" + keypadLength];
};

CompetitionStatistics.prototype.saveOneDifferenceFindTime = function (time) {
    console.log("save diff time", time);
    this._newData("diff_time", time);
};

CompetitionStatistics.prototype.getOneDifferenceFindTime = function () {
    return this.data.diff_time;
};

CompetitionStatistics.prototype.load = function () {
    this.updateInfo(cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.COMPETITION_STATISTICS) || {});
};

CompetitionStatistics.prototype.updateInfo = function (data, fromServer) {
    this.data = {};
    for (var type in CompetitionStatistics.DEFAULTS) {
        this.data[type] = (data[type] && this._isAppropriateValue(type, data[type])) ? data[type] : CompetitionStatistics.DEFAULTS[type];
    }
    if (fromServer) {
        this.save(true);
    }
};

CompetitionStatistics.prototype.getInfo = function () {
    var data = {};
    for (var type in CompetitionStatistics.DEFAULTS) {
        if (CompetitionStatistics.DEFAULTS[type] !== this.data[type]) {
            data[type] = this.data[type];
        }
    }
    return data;
};

CompetitionStatistics.prototype.save = function (fromServer) {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.COMPETITION_STATISTICS, this.getInfo());
    if (!fromServer) {
        cleverapps.synchronizer.addUpdateTask("competitionstatistics");
    }
};

CompetitionStatistics.DEFAULTS = {
    "brd_l4": 8,
    "brd_l5": 15,
    "brd_l6": 20,
    "brd_l7": 30,
    "brd_l8": 40,
    "brd_l9": 50,
    "diff_time": 30
};