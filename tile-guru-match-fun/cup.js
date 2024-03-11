/**
 * Created by andrey on 29.01.19.
 */

var Cup = function (type, innerCup) {
    this.type = type;
    this.config = CupsConfig.TYPES[this.type];
    this.innerCup = innerCup;

    if (!CupsConfig.IsEnabled(this.type)) {
        return;
    }

    this.onChangedView = function () {};
    this.onChangedTable = function () {};
    this.onChangedIcon = function () {};

    this.load();

    this.reload(true);
    setInterval(this.reload.bind(this), Cup.RELOAD_INTERVAL);
};

Cup.prototype.runOnChangeListeners = function () {
    this.onChangedIcon();
    this.onChangedView();
    this.onChangedTable();
};

Cup.prototype.load = function () {
    var info = cleverapps.DataLoader.load(cleverapps.DataLoaderTypes.CUP + this.type);

    info = info || {};

    this.participantId = info.participantId;
    this.start = info.start || 0;
    this.end = info.end || 0;
    this.stars = info.stars || 0;
    this.delta = info.delta || 0;
    this.state = info.state === undefined ? Cup.STATE_PENDING : info.state;
    this.participants = [];

    clearTimeout(this.timeout);

    var timeLeft = this.getTimeLeft();
    if (timeLeft) {
        this.timeout = new cleverapps.LongTimeout(this.reload.bind(this), timeLeft);
    }
};

Cup.prototype.save = function () {
    var info = {
        participantId: this.participantId,
        start: this.start,
        end: this.end,
        stars: this.stars,
        delta: this.delta,
        state: this.state
    };

    cleverapps.DataLoader.save(cleverapps.DataLoaderTypes.CUP + this.type, info);
};

Cup.prototype.next = function () {
    this.state = Cup.STATE_PENDING;
    this.save();
    this.runOnChangeListeners();

    this.reload();

    if (this.innerCup) {
        this.innerCup.next();
    }
};

Cup.prototype.updateCup = function (data) {
    if (!data || !data.start) {
        this.state = Cup.STATE_PENDING;
        this.save();
        return;
    }

    if (this.start !== data.start) {
        this.start = data.start || 0;
        this.delta = 0;
        this.state = Cup.STATE_RUNNING;
        this.wantsToShow = true;

        cleverapps.cupsTopTable.resetResults(this.type);
        cleverapps.cupsLeadersTable.resetResults("cache");
    }

    this.participantId = data.participantId;
    this.end = Date.now() + data.time || 0;
    this.stars = data.stars + this.delta || 0;
    this.participants = data.participants || [];

    clearTimeout(this.timeout);

    var timeLeft = this.getTimeLeft();
    if (timeLeft) {
        this.state = Cup.STATE_RUNNING;
        this.timeout = new cleverapps.LongTimeout(this.reload.bind(this), timeLeft);
    } else if (this.state === Cup.STATE_RUNNING) {
        this.state = Cup.STATE_FINISHED;

        if (!this.getReward()) {
            this.state = Cup.STATE_RECEIVED;
            this.wantsToShow = false;
        }

        cleverapps.cupsLeadersTable.resetResults("cache");
    }

    this.save();
};

Cup.prototype.isAvailable = function (options) {
    return CupsConfig.IsEnabled(this.type) && cleverapps.user.checkAvailable(this.config.available, options);
};

Cup.prototype.isActive = function () {
    return this.state !== Cup.STATE_PENDING;
};

Cup.prototype.isRunning = function () {
    return this.state === Cup.STATE_RUNNING && this.getTimeLeft();
};

Cup.prototype.isFinished = function () {
    return this.state !== Cup.STATE_RUNNING;
};

Cup.prototype.hasConnection = function () {
    return !this.noConnection;
};

Cup.prototype.getTimeLeft = function () {
    return Math.max(0, this.end - Date.now());
};

Cup.prototype.reload = function (force) {
    if (this.reloading || !this.isAvailable() || !force && !cleverapps.environment.hasScene(this.config.scenes)) {
        return;
    }

    if (this.state === Cup.STATE_RECEIVED && this.end + this.config.restartAfter < Date.now()) {
        this.next();
        return;
    }

    var delta = this.delta;
    this.delta = 0;
    this.save();

    var onFailure = function () {
        this.reloading = false;
        this.noConnection = true;
        this.delta += delta;
        this.save();
        this.runOnChangeListeners();
    }.bind(this);

    var onSuccess = function (data) {
        this.reloading = false;
        this.noConnection = false;
        this.updateCup(data);
        this.runOnChangeListeners();
    }.bind(this);

    this.reloading = true;

    var data = {
        type: this.type,
        userId: cleverapps.platform.getUserID(),
        delta: delta
    };

    if (this.state !== Cup.STATE_PENDING) {
        data.start = this.start;
    }

    cleverapps.RestClient.post("/dailycup/sync/", data, onSuccess, onFailure);
};

Cup.prototype.addAmount = function (stars) {
    if (!this.isRunning() || !stars) {
        return;
    }

    this.stars += stars;
    this.delta += stars;
    this.save();
    this.runOnChangeListeners();
};

Cup.prototype.listParticipants = function () {
    var participants = this.participants.slice();
    var player;

    for (var i = 0; i < participants.length; ++i) {
        if (participants[i].id === this.participantId) {
            player = participants[i];
        }
    }

    var user = cleverapps.friends.getPlayer();
    if (this.type === CupsConfig.TYPE_CLAN) {
        user = cleverapps.userClan;
    }

    if (!player) {
        player = {
            id: user.id,
            avatar: user.avatar || user.emblem,
            name: user.name
        };
        participants.push(player);
    }

    player.amount = this.stars;
    player.player = true;

    participants.sort(function (a, b) {
        return b.amount - a.amount;
    });

    participants.forEach(function (player, index) {
        player.cup = this;
        player.place = index + 1;
        player.text = player.name;

        if (this.config.participateAsClan) {
            player.emblem = player.avatar;
        }
    }.bind(this));

    return participants;
};

Cup.prototype.calcPlace = function () {
    if (!this.stars) {
        return;
    }

    for (var i = 0; i < this.participants.length; i++) {
        var participant = this.participants[i];

        if (participant.id === this.participantId) {
            return i;
        }

        if (participant.amount < this.stars) {
            return i;
        }
    }
    return this.participants.length;
};

Cup.prototype.listRewards = function () {
    return this.config.rewards;
};

Cup.prototype.getReward = function () {
    if (this.state === Cup.STATE_FINISHED) {
        var rewards = this.listRewards();
        var place = this.calcPlace();
        return rewards[place];
    }
};

Cup.prototype.receiveReward = function (f) {
    var reward = this.getReward();
    var place = this.calcPlace();
    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.CUP_REWARD + this.type + "_" + this.start + "_" + (place + 1));

    RewardWindow.createCupsWindow(reward, this.type);
    cleverapps.meta.onceNoWindowsListener = f;

    this.state = Cup.STATE_RECEIVED;
    this.save();
    this.runOnChangeListeners();
};

Cup.prototype.withLives = function () {
    return cleverapps.lives && cleverapps.config.type !== "board";
};

Cup.prototype.wantsToPlay = function (f) {
    if (this.withLives() && cleverapps.lives.isEmpty()) {
        new LivesShopWindow();
        cleverapps.meta.onceNoWindowsListener = f;
        return;
    }

    var chosen = Episode.LevelChooseAlgorithm({
        start: 5,
        seed: (this.start || 0) * 1000 + (this.stars || 0)
    });

    var episode = new Episode(chosen.episodeNo, chosen.levelNo, {
        type: Episode.Types.DAILYCUP
    });

    MethaHelper.start(f, episode.getLevel());
};

Cup.prototype.getForce = function () {
    return this.config.force;
};

Cup.prototype.needsAttention = function () {
    var place = this.calcPlace();
    return this.getReward() || place !== undefined && place !== this.lastShownPlace;
};

Cup.prototype.afterWindowShown = function () {
    this.wantsToShow = false;
    this.lastShownPlace = cleverapps.clanCup.calcPlace();
};

Cup.STATE_RUNNING = 0;
Cup.STATE_FINISHED = 1;
Cup.STATE_RECEIVED = 2;
Cup.STATE_PENDING = 3;

Cup.RELOAD_INTERVAL = cleverapps.parseInterval("30 seconds");
