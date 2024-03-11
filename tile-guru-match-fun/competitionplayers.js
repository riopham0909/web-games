/**
 * Created by andrey on 18.09.19.
 */

var CompetitionPlayers = function () {
    this.onAvailableListeners = {};

    this.load();

    this.reload();
    setInterval(this.reload.bind(this), cleverapps.parseInterval(CompetitionPlayers.RELOAD_INTERVAL));
};

CompetitionPlayers.prototype.reload = function () {
    if (this.reloading) {
        return;
    }

    this.reloading = true;

    var onSuccess = function (players) {
        this.reloading = false;

        this.players = [];
        for (var i = 0; i < players.length; i++) {
            if (players[i].id !== cleverapps.platform.getUserID() && players[i].name && players[i].name.length > 0) {
                this.players.push({
                    id: players[i].id,
                    name: players[i].name,
                    avatar: players[i].avatar
                });
            }
        }
        this.save();

        if (this.players.length > 0) {
            for (var key in this.onAvailableListeners) {
                this.onAvailableListeners[key]();
            }
        }
    }.bind(this);

    var onFailure = function () {
        this.reloading = false;
    }.bind(this);

    var path = "/competitionplayers/?locale=" + cleverapps.settings.language;
    if (cleverapps.platform.oneOf(Microsoft)) {
        path += "&amountPlayers=" + 30;
    }
    if (cleverapps.config.debugMode) {
        path = "https://riddles.labsystech.ru/riddles-rest" + path;
    }

    cleverapps.RestClient.get(path, {}, onSuccess, onFailure);
};

CompetitionPlayers.prototype.getAmount = function () {
    return this.players.length;
};

CompetitionPlayers.prototype.listFakePlayers = function (amount) {
    var players = [];
    for (var i = 0; i < amount; i++) {
        players.push({
            id: Math.round(Math.random() * 1000000),
            name: ("player" + i),
            fake: true
        });
    }
    return players;
};

CompetitionPlayers.prototype.listPlayers = function (amount) {
    var players = this.players.splice(0, amount);
    this.save();

    this.reload();

    return players;
};

CompetitionPlayers.prototype.load = function () {
    this.players = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.COMPETITION_PLAYERS) || [];
};

CompetitionPlayers.prototype.save = function () {
    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.COMPETITION_PLAYERS, this.players);
};

CompetitionPlayers.RELOAD_INTERVAL = "30 minutes";
