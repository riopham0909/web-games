/**
 * Created by mac on 7/23/18
 */

var Competition = function (options) {
    this.type = options.type;
    this.options = options;

    var data = undefined;

    if (options.store) {
        data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.COMPETITION + "_" + this.type);

        // tmp backwards compatibility
        if (!data && [Mission.TYPE_COMBO, Mission.TYPE_COLLECT_MARK, Mission.TYPE_BURN_NEARBY, Mission.TYPE_LETTER].indexOf(this.type) !== -1) {
            data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.COMPETITION);
        }
        cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.COMPETITION);
    }

    if (data) {
        this.results = data.results;
        options.algo.lastProcessed = data.algorithm;
    } else if (options.players) {
        this.results = options.players;
    } else {
        this.results = cleverapps.competitionPlayers.listFakePlayers(options.amount);
    }

    this.player = this.getPlayerById(cleverapps.platform.getUserID());

    if (!this.player) {
        this.player = {
            player: true,
            id: cleverapps.platform.getUserID(),
            name: cleverapps.friends.getPlayer().name,
            avatar: cleverapps.friends.getPlayer().avatar,
            amount: 0
        };

        this.results.push(this.player);
    }

    if (options.playerResult !== undefined) {
        this.player.amount = options.playerResult;
    }

    this.running = true;

    this.onChangeResultsListeners = {};
    this.onLoseListener = function () {};
    this.onChangePlaceListener = function () {};

    this.updateShownPlace();

    this.algorithm = new CompetitionAlgorithm(this, this.options.algo);

    if (this.countFakePlayers() > 0) {
        this.onPlayersAvailable();
    }

    this.onAnimateResults = function () {};
    this.onGetOpponent = function () {};
    this.onGetUserView = function () {};
};

Competition.prototype.start = function () {
    this.algorithm.start();
};

Competition.optionsForTournament = function (game) {
    var type = "tournament";
    var data = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.COMPETITION + "_" + type) || {};

    if (!game.emptySave && data.level !== game.level.getHumanReadableNumber()) {
        return;
    }

    var players = data.results || [];
    if (game.emptySave) {
        Competition.CLEAN_SAVED(type);

        var forces = [0.5, 0.8, 1.1].sort(function () {
            return Math.random() < 0.5 ? -1 : 1;
        });

        players = cleverapps.competitionPlayers.listPlayers(3) || [];
        players.forEach(function (player, index) {
            player.amount = 0;
            player.force = forces[index];
        });
    }

    if (players.length < 3) {
        return;
    }

    cleverapps.UI.Avatar.preload(players);

    var averageProcessTimeout = cleverapps.competitionStatistics.getBoardGameWordOpenByKeypadLengthTime(game.keypad.amountKeys());
    var botAheadPlayerCoef = 0.25, botAheadPlayerBigDifferenceCoef = 0.3;

    return {
        type: type,
        amount: 3,
        level: game.level,
        store: true,
        lose: false,
        players: players,

        algo: {
            noPlayerEpisodeCoef: true,
            averageProcessTimeout: cleverapps.parseInterval(averageProcessTimeout + " seconds"),
            botAheadPlayerCoef: botAheadPlayerCoef,
            botAheadPlayerBigDifferenceCoef: botAheadPlayerBigDifferenceCoef,
            bigDistanceLength: 1,
            offlineProcess: true,
            useRealForce: true,
            duration: cleverapps.parseInterval("3 hour"),
            maxResult: game.totalItemsToSolve()
        }
    };
};

Competition.optionsForKnockoutGame = function (game) {
    var averageProcessTimeout = 10;
    if (cleverapps.config.type === "board") {
        averageProcessTimeout = cleverapps.competitionStatistics.getBoardGameWordOpenByKeypadLengthTime(game.keypad.amountKeys());
    } else if (cleverapps.config.type === "differences") {
        averageProcessTimeout = cleverapps.competitionStatistics.getOneDifferenceFindTime();
    }

    var rumble = cleverapps.meta.getRumble();
    var opponent = rumble.getCurrentRound().getOpponent(cleverapps.platform.getUserID());

    var botForces = [0.6, 0.8, 1];
    opponent.force = botForces[rumble.rounds.length - 1];
    opponent.amount = 0;

    var botAheadPlayerCoef = 0.3, botAheadPlayerBigDifferenceCoef = 0.5, playerAheadBotCoef = 1.5, playerAheadBotBigDifferenceCoef = 2, botFinishCoef = 0.5;

    switch (cleverapps.meta.getMainObject().knockoutGame.calcTournamentType()) {
        case KnockoutGame.BOT_CANNOT_WIN_TOURNAMENT:
            botFinishCoef = 0;
            playerAheadBotCoef = 2;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 0.8);
            break;
        case KnockoutGame.VERY_EASY_TOURNAMENT:
            botAheadPlayerCoef = 0.3;
            playerAheadBotCoef = 2;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 2.5);
            break;
        case KnockoutGame.EASY_TOURNAMENT:
            botAheadPlayerCoef = 0.4;
            playerAheadBotCoef = 1;
            botFinishCoef = 0.3;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 1.3);
            break;
        case KnockoutGame.NORMAL_TOURNAMENT:
            botAheadPlayerCoef = 0.5;
            playerAheadBotCoef = 1.2;
            botFinishCoef = 0.3;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 1.1);
            break;
        case KnockoutGame.DIFFICULT_TOURNAMENT:
            botAheadPlayerCoef = 0.6;
            playerAheadBotCoef = 1.5;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 0.8);
            break;
        case KnockoutGame.VERY_DIFFICULT_TOURNAMENT:
            botAheadPlayerCoef = 0.8;
            playerAheadBotCoef = 1.5;
            averageProcessTimeout = Math.floor(averageProcessTimeout * 0.5);
            break;
    }

    return {
        type: "knockout",
        amount: 1,

        players: [opponent],

        algo: {
            noPlayerEpisodeCoef: true,
            averageProcessTimeout: cleverapps.parseInterval(averageProcessTimeout + " seconds"),
            botAheadPlayerCoef: botAheadPlayerCoef,
            botAheadPlayerBigDifferenceCoef: botAheadPlayerBigDifferenceCoef,
            playerAheadBotCoef: playerAheadBotCoef,
            playerAheadBotBigDifferenceCoef: playerAheadBotBigDifferenceCoef,
            bigDistanceLength: 1,
            offlineProcess: false,
            useRealForce: true,
            duration: cleverapps.parseInterval("3 hour"),
            maxResult: game.totalItemsToSolve(),
            botFinishCoef: botFinishCoef
        }
    };
};

Competition.optionsByMission = function (mission) {
    var options = {
        store: true,
        type: mission.type,
        playerResult: mission.result,
        amount: Array.isArray(mission.competition.amount) ? cleverapps.Random.random(mission.competition.amount[0], mission.competition.amount[1], false) : mission.competition.amount
    };

    options.algo = {
        start: mission.started,
        finish: mission.finishTime()
    };

    Object.assign(options.algo, mission.competition);

    return options;
};

Competition.prototype.changePlayerId = function (oldId, newId) {
    if (this.player.id === oldId) {
        this.player.id = newId;
    }

    for (var i = 0; i < this.results.length; ++i) {
        if (this.results[i].id === oldId) {
            this.results[i].id = newId;
        }
    }
};

Competition.prototype.calcPlace = function () {
    this.results.sort(function (a, b) {
        if (b.amount !== a.amount) {
            return b.amount - a.amount;
        }
        if (this.type === "tournament" && a.event && b.event && a.event !== b.event) {
            return a.event - b.event;
        }
        if (a === this.player) {
            return -1;
        }
        if (b === this.player) {
            return 1;
        }
        return 0;
    }.bind(this));

    return this.results.indexOf(this.player);
};

Competition.prototype.updatePlayerResult = function (id, amount) {
    if (this.options.algo.maxResult && amount > this.options.algo.maxResult) {
        amount = this.options.algo.maxResult;
    }

    for (var i = 0; i < this.results.length; i++) {
        if (this.results[i].id === id && this.results[i].amount !== amount) {
            this.results[i].amount = amount;
            this.results[i].event = Date.now();
            this.runChangeResultsListeners(id);
            break;
        }
    }
    if (this.hasPlaceChanged()) {
        this.onChangePlaceListener();
    }

    var finishedOpponents = this.getFinishedOpponents().length;
    if (finishedOpponents === this.options.amount && this.options.lose !== false) {
        this.onLoseListener();
    }
};

Competition.prototype.hasPlaceChanged = function () {
    if (!this.lastShownPlace) {
        this.lastShownPlace = this.calcPlace();
        return false;
    }

    return this.lastShownPlace !== this.calcPlace();
};

Competition.prototype.updateShownPlace = function () {
    this.lastShownPlace = this.calcPlace();
};

Competition.prototype.getFinishedOpponents = function () {
    return this.results.filter(function (result) {
        return result.id !== cleverapps.platform.getUserID() && result.amount === this.options.algo.maxResult;
    }.bind(this));
};

Competition.prototype.runChangeResultsListeners = function (id) {
    cleverapps.values(this.onChangeResultsListeners).forEach(function (listener) {
        listener(id);
    });
};

Competition.prototype.stop = function () {
    this.running = false;
    delete cleverapps.competitionPlayers.onAvailableListeners[this.type];
    this.algorithm.stop();
};

Competition.prototype.onPlayersAvailable = function () {
    delete cleverapps.competitionPlayers.onAvailableListeners[this.type];

    if (this.running) {
        var players = cleverapps.competitionPlayers.listPlayers(Math.min(this.countFakePlayers(), cleverapps.competitionPlayers.getAmount()));
        this.replaceFakePlayers(players);

        if (this.countFakePlayers() > 0) {
            cleverapps.competitionPlayers.onAvailableListeners[this.type] = this.onPlayersAvailable.bind(this);
        }
    }
};

Competition.CLEAN_SAVED = function (type) {
    cleverapps.DataLoader.remove(cleverapps.DataLoaderTypes.COMPETITION + "_" + type);
};

Competition.prototype.countFakePlayers = function () {
    var fakePlayers = 0;
    this.results.forEach(function (result) {
        if (result.fake) {
            fakePlayers++;
        }
    });
    return fakePlayers;
};

Competition.prototype.replaceFakePlayers = function (players) {
    var offset = 0;
    for (var i = 0; i < this.results.length && offset < players.length; i++) {
        var result = this.results[i];
        if (result.fake) {
            result.id = players[offset].id;
            result.name = players[offset].name;
            result.avatar = players[offset].avatar;
            delete result.fake;
            offset++;
        }
    }

    this.save();
};

Competition.prototype.getPlayerById = function (id) {
    return this.results.filter(function (result) {
        return result.id === id;
    })[0];
};

Competition.prototype.getResults = function () {
    return this.results.slice();
};

Competition.prototype.save = function () {
    if (this.options.store) {
        cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.COMPETITION + "_" + this.type, {
            results: this.results,
            algorithm: this.algorithm.getData(),
            level: this.options.level ? this.options.level.getHumanReadableNumber() : undefined
        });
    }
};

Competition.prototype.onUserInfoChanged = function () {
    this.player.name = cleverapps.friends.getPlayer().name;
    this.player.avatar = cleverapps.friends.getPlayer().avatar;
    this.player.id = cleverapps.friends.getPlayer().id;

    this.save();
};