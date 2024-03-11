/**
 * Created by mac on 7/23/18
 */

var CompetitionAlgorithm = function (competition, options) {
    this.competition = competition;
    this.options = options;
    if (options.start === undefined) {
        options.start = Date.now();
        options.finish = options.start + options.duration;
    }
    this.lastProcessed = options.lastProcessed || options.start;
};

CompetitionAlgorithm.prototype.start = function () {
    if (!this.isPrepared()) {
        this.prepareFromScratch();
    }

    if (this.competition.running) {
        this.intervalProcess();

        this.runInterval = setInterval(function () {
            if (this.competition.running) {
                this.intervalProcess();
            } else {
                this.stop();
            }
        }.bind(this), this.intervalTimeout());
    }
};

CompetitionAlgorithm.prototype.stop = function () {
    if (this.runInterval) {
        clearInterval(this.runInterval);
        this.runInterval = undefined;
    }
};

CompetitionAlgorithm.prototype.getData = function () {
    return this.lastProcessed;
};

CompetitionAlgorithm.prototype.process = function (offline) {
    var processed = [];
    for (var i = 0; i < this.competition.results.length; i++) {
        var bot = this.competition.results[i];
        if (!bot.player && Math.random() < this.botProcessProb(bot, offline)) {
            if (this.options.maxResult && bot.amount === this.options.maxResult) {
                continue;
            }
            var amount = bot.amount + this.processAmount();
            if (this.options.maxResult && amount > this.options.maxResult) {
                amount = this.options.maxResult;
            }
            if (bot.amount !== amount) {
                processed.push({
                    id: bot.id,
                    amount: amount
                });
            }
        }
    }

    if (processed.length > 0) {
        for (i = 0; i < processed.length; i++) {
            this.competition.updatePlayerResult(processed[i].id, processed[i].amount);
        }
        this.competition.save();
    }
};

CompetitionAlgorithm.prototype.isPrepared = function () {
    for (var i = 0; i < this.competition.results.length; i++) {
        if (!this.competition.results[i].player) {
            return this.competition.results[i].force !== undefined;
        }
    }
    return true;
};

CompetitionAlgorithm.prototype.prepareFromScratch = function () {
    var results = this.competition.results;

    results.forEach(function (result) {
        if (result.player) {
            return;
        }

        result.amount = 0;

        result.force = Math.floor(Math.random() * (CompetitionAlgorithm.BOT_MAX_FORCE + 1));

        if (this.options.minBotForce) {
            result.force = Math.max(result.force, this.options.minBotForce);
        }

        result.sleep = this.generateSleepPeriod();
    }, this);

    this.competition.save();
};

CompetitionAlgorithm.prototype.generateSleepPeriod = function () {
    var duration = this.options.finish - this.options.start;
    if (duration < cleverapps.parseInterval("1 hour")) {
        return undefined;
    }

    var timeout = Math.floor(duration / 4 + Math.random() * duration / 4);
    var start = this.options.start + Math.floor(Math.random() * (duration - timeout));
    return {
        s: start,
        f: start + timeout
    };
};

CompetitionAlgorithm.prototype.offlineCoef = function () {
    if (this.options.offlineCoef !== undefined) {
        return this.options.offlineCoef;
    }
    return 0.3;
};

CompetitionAlgorithm.prototype.playerAheadBotCoef = function () {
    if (this.options.playerAheadBotCoef !== undefined) {
        return this.options.playerAheadBotCoef;
    }
    return 1;
};

CompetitionAlgorithm.prototype.playerAheadBot5AmountCoef = function () {
    if (this.options.playerAheadBotBigDifferenceCoef !== undefined) {
        return this.options.playerAheadBotBigDifferenceCoef;
    }
    return 2;
};

CompetitionAlgorithm.prototype.botAheadPlayerCoef = function () {
    return this.options.botAheadPlayerCoef !== undefined ? this.options.botAheadPlayerCoef : 0.3;
};

CompetitionAlgorithm.prototype.botAheadPlayer5AmountCoef = function () {
    return this.options.botAheadPlayerBigDifferenceCoef !== undefined ? this.options.botAheadPlayerBigDifferenceCoef : 0.1;
};

CompetitionAlgorithm.prototype.mediumAmount = function () {
    var step = this.options.step;
    if (step && step.length > 0) {
        return step.reduce(function (result, value) {
            return result + value; 
        }, 0) / step.length;
    }
    return 1;
};

CompetitionAlgorithm.prototype.processAmount = function () {
    var step = this.options.step;
    if (step) {
        if (step.length > 2) {
            return cleverapps.Random.choose(step, false);
        }
        return cleverapps.Random.random(step[0], step[1], false);
    }
    return 1;
};

CompetitionAlgorithm.prototype.getBotForceCoef = function (force) {
    if (this.options.useRealForce) {
        return force;
    }
    var coefs = [0, 0.03, 0.08, 0.15, 0.25, 0.35, 0.5, 0.7, 1, 1.5, 2];
    return (coefs[force] !== undefined ? coefs[force] : 2) * (this.options.forceCoef || 1);
};

CompetitionAlgorithm.prototype.sleepNow = function (bot) {
    if (!bot.sleep) {
        return false;
    }
    return bot.sleep.s <= this.lastProcessed && this.lastProcessed <= bot.sleep.f;
};

CompetitionAlgorithm.prototype.bigDistanceLength = function () {
    return this.options.bigDistanceLength ? this.options.bigDistanceLength : 5;
};

CompetitionAlgorithm.prototype.calcFromBotAmountCoef = function (bot) {
    if (!this.options.maxResult || this.options.maxResult < 2) {
        return 1;
    }
    var d = (this.options.maxResult - 1) / 2;
    return 1.25 - 0.75 * (bot.amount - d) / d;
};

CompetitionAlgorithm.prototype.botProcessProb = function (bot, offline) {
    if (this.sleepNow(bot)) {
        return 0;
    }

    var playerAmount = this.competition.player.amount;

    var prob = this.perIntervalProb(offline);
    if (bot.amount >= playerAmount) {
        prob *= this.botAheadPlayerCoef(bot);
        if (bot.amount > playerAmount + this.bigDistanceLength() * this.mediumAmount()) {
            prob *= this.botAheadPlayer5AmountCoef(bot);
        }
    } else {
        prob *= this.playerAheadBotCoef(bot);
        if (playerAmount > bot.amount + this.bigDistanceLength() * this.mediumAmount()) {
            prob *= this.playerAheadBot5AmountCoef(bot);
        }
    }

    if (this.options.botFinishCoef !== undefined && this.options.maxResult && bot.amount + this.mediumAmount() >= this.options.maxResult) {
        prob *= this.options.botFinishCoef;
    }
    prob *= this.calcFromBotAmountCoef(bot);

    return prob * this.playerEpisodeCoef() * this.getBotForceCoef(bot.force);
};

CompetitionAlgorithm.prototype.perIntervalProb = function (offline) {
    if (offline) {
        if (!this.offlinePerIntervalProb) {
            this.offlinePerIntervalProb = this.offlineCoef() * this.intervalTimeout(offline) / this.maxForceBotAverageProcessTimeout();
        }
        return this.offlinePerIntervalProb;
    }
    if (!this.onlinePerIntervalProb) {
        this.onlinePerIntervalProb = this.intervalTimeout(offline) / this.maxForceBotAverageProcessTimeout();
    }
    return this.onlinePerIntervalProb;
};

CompetitionAlgorithm.prototype.intervalTimeout = function (offline) {
    return cleverapps.parseInterval(offline ? "10 minutes" : "5 seconds");
};

CompetitionAlgorithm.prototype.freeze = function (freezeTime) {
    var ct = Date.now();
    if (this.lastProcessed > ct) {
        this.lastProcessed += freezeTime;
    } else {
        this.lastProcessed = ct + freezeTime;
    }
};

CompetitionAlgorithm.prototype.intervalProcess = function () {
    var ct = Math.min(Date.now(), this.options.finish);

    if (this.lastProcessed > ct) {
        return;
    }

    var offlineTimeout = this.intervalTimeout(true);
    var onlineTimeout = this.intervalTimeout();

    if (this.options.offlineProcess !== false) {
        while (this.lastProcessed < ct - 2 * offlineTimeout) {
            this.lastProcessed += offlineTimeout;
            this.process(true);
        }
    }

    while (this.lastProcessed < ct - onlineTimeout / 2) {
        this.lastProcessed += onlineTimeout;
        this.process();
    }

    this.lastProcessed = ct;
    this.competition.save();
};
CompetitionAlgorithm.prototype.maxForceBotAverageProcessTimeout = function () {
    return this.options.averageProcessTimeout ? this.options.averageProcessTimeout : cleverapps.parseInterval("3 minutes");
};

CompetitionAlgorithm.prototype.playerEpisodelevel = function () {
    if (levels.user.episode >= 10) {
        return 2;
    }
    if (levels.user.episode >= 5) {
        return 1;
    }
    return 0;
};

CompetitionAlgorithm.prototype.playerEpisodeCoef = function () {
    if (this.options.noPlayerEpisodeCoef) {
        return 1;
    }
    return [0.1, 0.13, 0.15][this.playerEpisodelevel()];
};

CompetitionAlgorithm.BOT_MAX_FORCE = 10;