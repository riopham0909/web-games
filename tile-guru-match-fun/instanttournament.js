/**
 * Created by spepa on 05.04.2023
 */

var InstantTournament = function () {
    this.id = undefined;
    this.score = 0;

    this.load();

    if (cleverapps.platform.isConnected(Platform.PLATFORM)) {
        this.updateId();
    }

    cleverapps.platform.on("changeStatus:" + Platform.PLATFORM, function (status) {
        if (status === Platform.STATUS_CONNECTED) {
            this.updateId();
        }
    }.bind(this));
};

InstantTournament.prototype.updateId = function () {
    cleverapps.platform.getCurrentTournamentId(function (id) {
        if (id !== this.id) {
            this.id = undefined;
        }
    }.bind(this));
};

InstantTournament.prototype.load = function () {
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.INSTANT_TOURNAMENT);
    if (data) {
        this.id = data.id;
        this.score = data.score;
        this.lastReport = data.lastReport;
    }
};

InstantTournament.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.INSTANT_TOURNAMENT, {
        id: this.id,
        score: this.score,
        lastReport: this.lastReport
    });
};

InstantTournament.prototype.isInTournament = function () {
    return this.id !== undefined;
};

InstantTournament.prototype.updateScore = cleverapps.accumulate(1000, function () {
    var level = cleverapps.user.getFloatLevel();
    if (level < 5) {
        return;
    }

    if (cleverapps.timeStart === undefined || Date.now() - cleverapps.timeStart < 60000) {
        return;
    }

    if (this.lastReport + InstantTournament.REPORT_TIMEOUT > Date.now()) {
        return;
    }

    var score = Math.round(level * 100);

    var per = 10;
    if (level < 9) {
        per = 50;
    }

    if (score < (Math.floor(this.score / per) + 1) * per) {
        return;
    }

    cleverapps.platform.getCurrentTournamentId(function (id) {
        if (this.id === id && this.score === score) {
            return;
        }

        console.log("Instant report score");

        this.lastReport = Date.now();
        cleverapps.platform.reportScore(score, function (id) {
            console.log("Instant report score success", id);

            if (id) {
                this.id = id;
                this.score = score;
                this.save();
            }
        }.bind(this));
    }.bind(this));
});

InstantTournament.REPORT_TIMEOUT = 60000;
if (cleverapps.config.type === "merge") {
    InstantTournament.REPORT_TIMEOUT = cleverapps.parseInterval("2 days");
}