/**
 * Created by slava on 02.02.17.
 */

var levels = {};

levels.User = function (isNewUser) {
    this.onLevelStatusChanged = function () {};

    cleverapps.User.call(this, isNewUser);

    cleverapps.platform.on("userIdChanged", this.onUserIdChanged.bind(this));
};

levels.User.prototype = Object.create(cleverapps.User.prototype);
levels.User.prototype.constructor = levels.User;

levels.User.prototype.getProgress = function () {
    return cleverapps.humanReadableNumber(this.episode, this.level) - 1;
};

levels.User.prototype.getVirtualProgress = function () {
    return cleverapps.humanReadableNumber(this.episode, this.level) + this.progress - 1;
};

levels.User.prototype.loadData = function (info) {
    cleverapps.User.prototype.loadData.call(this, info);
    this.episode = info.episode;
    this.level = info.level;
    this.league = this.calcLeague();
    this.progress = info.progress || 0;

    if (info.uniqueStartEvent) {
        this.uniqueStartEvent = info.uniqueStartEvent;
    }

    this.calcRating();
};

levels.User.prototype.calcRating = function () {
    var newLeague = this.calcLeague();
    if (this.league !== newLeague) {
        this.league = newLeague;
        this.isLeagueChanged = true;
        this.onLeagueChangeListener();
    }
    this.save();
};

levels.User.prototype.isUniqueStart = function (episodeNo, levelNo, version) {
    var uniqueStartEvent = episodeNo + "_" + levelNo + "_" + version;

    if (this.uniqueStartEvent === uniqueStartEvent) {
        return false;
    }

    this.uniqueStartEvent = uniqueStartEvent;
    this.save(false);

    return true;
};

levels.User.prototype.getPassAllProgress = function () {
    return this.progress;
};

levels.User.prototype.isCurrentLevel = function (levelNo, episodeNo) {
    if (cleverapps.meta.getType() !== Metha.HOSE) {
        return true;
    }
    var currentLevel = this.getCurrentLevel();
    return currentLevel.levelNo === levelNo && currentLevel.episodeNo === episodeNo;
};

levels.User.prototype.isPassedLevel = function (levelNo, episodeNo) {
    return this.episode > episodeNo || this.episode === episodeNo && this.level > levelNo;
};

levels.User.prototype.getHumanReadableNumber = function () {
    return cleverapps.humanReadableNumber(this.episode, this.level);
};

levels.User.prototype.checkAvailable = function (available, options) {
    available = available || {};
    options = options || [];

    var projectName = cleverapps.config.name;
    if (available[projectName]) {
        return this.checkAvailable(available[projectName], options);
    }

    if (cleverapps.config.subtype && available[cleverapps.config.subtype]) {
        return this.checkAvailable(available[cleverapps.config.subtype], options);
    }

    var source = cleverapps.platform.source;
    if (available[source]) {
        return this.checkAvailable(available[source], options);
    }

    if (!cleverapps.config.debugMode && available.registeredDate && this.registered < new Date(available.registeredDate).getTime()) {
        return false;
    }

    if (!cleverapps.config.debugMode && available.registered && this.registered + cleverapps.parseInterval(available.registered) > Date.now()) {
        return false;
    }

    if (available.disabled) {
        return false;
    }

    if (available.debugMode && !cleverapps.config.debugMode) {
        return false;
    }

    available.level = available.level || 0;
    available.episode = available.episode || 0;

    if (available.projectName) {
        available.projectName = cleverapps.toArray(available.projectName);
        if (available.projectName.indexOf(projectName) === -1) {
            return false;
        }
    }
    if (available.types && available.types.indexOf(cleverapps.config.type) === -1) {
        return false;
    }
    if (available.meta && available.meta.indexOf(cleverapps.meta.getType()) === -1) {
        return false;
    }
    if (available.source) {
        if (!Array.isArray(available.source)) {
            available.source = [available.source];
        }
        if (available.source.indexOf(source) === -1) {
            return false;
        }
    }

    if (available.language && cleverapps.settings.language !== available.language) {
        return false;
    }

    if (available.payments && cleverapps.flags.videoAdsMainMonetization) {
        return false;
    }

    if (available.fogId && !Game.currentGame.fogs.isOpened(available.fogId)) {
        return false;
    }

    if (available.paymentsCountry && cleverapps.paymentsCountry && PaymentsCountry.isApplicable()
        && cleverapps.paymentsCountry.getCode() !== available.paymentsCountry) {
        return false;
    }

    if (options.ignoreProgress) {
        return true;
    }

    if (available.gameLevel !== undefined) {
        return cleverapps.gameLevel.level >= available.gameLevel;
    }

    return this.getFloatLevel() + 0.001 >= available.level;
};

levels.User.prototype.getFloatLevel = function (episode, level) {
    if (episode === undefined) {
        episode = this.episode;
    }

    if (level === undefined) {
        level = this.level;
    }

    if (cleverapps.config.type === "merge") {
        return level + Math.min(1, cleverapps.expBySlots[CustomSyncers.SLOT_MAIN].getExp() / cleverapps.gameLevel.nextLevelThreshold(true));
    }

    if (cleverapps.config.regime === "knockout") {
        return 6 * (episode + level / Episode.LEVELS_PER_EPISODE);
    }

    return 2 * (episode + level / Episode.LEVELS_PER_EPISODE);
};

levels.User.prototype.parseFloatLevel = function (floatingLevel) {
    var data = { episodeNo: 0, levelNo: 0 };

    for (var levelNo = 0, episodeNo = 0; ; ++levelNo) {
        if (cleverapps.config.type !== "merge" && levelNo >= Episode.LEVELS_PER_EPISODE) {
            levelNo = 0;
            episodeNo += 1;
        }

        if (this.getFloatLevel(episodeNo, levelNo) > floatingLevel) {
            return data;
        }

        data.episodeNo = episodeNo;
        data.levelNo = levelNo;
    }
};

levels.User.prototype.sendLevelPassedEvents = function () {
    var levels = [50, 100, 200];
    var days = [1, 3, 5];
    var daysSinceRegistered = this.getDaysSinceRegistration();
    var newLevel = this.getHumanReadableNumber();
    levels.forEach(function (level) {
        if (level + 1 === newLevel) {
            days.forEach(function (day) {
                if (daysSinceRegistered < day) {
                    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.STATS.LEVEL_PASS_EVENT + "_" + level + "_" + day);
                }
            }, this);
        }
    }, this);
};

levels.User.prototype.isPassedAll = function () {
    return cleverapps.isLevels() && this.episode >= cleverapps.episodes.getAmountEpisodes();
};

levels.User.prototype.incLevel = function () {
    if (this.isPassedAll()) {
        this.progress++;
        if (cleverapps.config.type === "board") {
            var level = this.getCurrentLevel();
            cleverapps.GameSaver.removeSave(cleverapps.GameSaver.getStoreSlot(level.episodeNo, level.levelNo));
        }
        this.trigger("incLevel");
        this.calcRating();
        this.save();
        return;
    }

    var previousLevel = this.level;
    var previousEpisode = this.episode;

    this.level++;
    if (this.level === Episode.LEVELS_PER_EPISODE) {
        this.level = 0;
        this.incEpisode();
    }
    this.trigger("incLevel");
    this.calcRating();
    this.save();

    this.sendLevelPassedEvents();
    this.onLevelStatusChanged(previousEpisode, previousLevel);
    this.onLevelStatusChanged(this.episode, this.level);

    if (this.getHumanReadableNumber() === 1 && this.getDaysSinceRegistration() === 0) {
        this.reportRetention();
    }
};

levels.User.prototype.incEpisode = function () {
    this.episode++;
    this.calcRating();
    this.save();

    cleverapps.eventLogger.logEvent(cleverapps.EVENTS.GENERAL.LEVEL_UP, {
        level: this.episode
    });

    if (cleverapps.EVENTS.TARGET_FOR_BUYING["BASE_REACH_" + (this.episode + 3)]) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING["BASE_REACH_" + (this.episode + 3)]);
    }

    if (this.episode >= 3) {
        cleverapps.eventLogger.logEvent(cleverapps.EVENTS.TARGET_FOR_BUYING.BASE_PLAY_WATCH);
    }
};

levels.User.prototype.getPhysicalLevel = function () {
    return this.getHumanReadableNumber();
};

levels.User.prototype.getCurrentLevel = function () {
    if (this.isPassedAll()) {
        return Episode.LevelChooseAlgorithm({
            start: 5,
            seed: this.progress
        });
    }

    return {
        episodeNo: this.episode,
        levelNo: this.level
    };
};

levels.User.prototype.getVirtualLevel = function () {
    return this.getHumanReadableNumber() + this.progress;
};

levels.User.prototype.getVirtualDisplayLevel = function () {
    return this.getVirtualLevel();
};

levels.User.prototype.setLevel = function (level) {
    this.episode = Math.floor(level / 15);
    this.level = level % 15;
    this.progress = 0;

    var total = cleverapps.episodes.getAmountEpisodes();
    if (this.episode >= total) {
        this.episode = total;
        this.level = 0;
        this.progress = level - this.getHumanReadableNumber() + 1;
    }

    this.save();
};

levels.User.prototype.onUserIdChanged = function (params) {
    var oldId = params.oldId;
    var newId = params.newId;

    delete this.idfa;
    this.save(false);

    cleverapps.abTest.updateGroups();

    var rumble = cleverapps.isRumble() && cleverapps.meta.getRumble();
    if (rumble) {
        rumble.changePlayerId(oldId, newId);
    }

    var competition = Game.currentGame && Game.currentGame.competition;
    if (competition) {
        competition.changePlayerId(oldId, newId);
    }
    cleverapps.userIdsHistory.add(oldId);

    this.updateIDFA();
};

levels.User.prototype.getSaveInfo = function () {
    var info = cleverapps.User.prototype.getSaveInfo.call(this);
    return Object.assign(info, {
        episode: this.episode,
        level: this.level,
        uniqueStartEvent: this.uniqueStartEvent,
        progress: this.progress
    });
};

levels.User.prototype.updateInfo = function (serverData) {
    delete serverData.source;

    var visited = serverData.visited;

    if (serverData.forcedVisited) {
        serverData.visited = serverData.forcedVisited;
    } else {
        delete serverData.visited;
    }

    var exp = serverData.exp;
    delete serverData.exp;

    cleverapps.expBySlots[CustomSyncers.SLOT_MAIN].load(exp);

    for (var item in serverData) {
        this[item] = serverData[item];
    }

    this.save(false);

    if (visited && !this.lastReportDAU) {
        this.lastReportDAU = this.getDaysSinceRegistration(visited);
    }
};

levels.User.prototype.getInfo = function () {
    return {
        id: cleverapps.platform.getUserID(),
        gold: this.gold,
        soft: this.soft,
        registered: this.registered,
        visited: this.visited,
        source: cleverapps.platform.source,
        channel: this.channel,
        progressCompare: this.progressCompare,
        progress: this.progress,
        level: this.level,
        episode: this.episode,
        exp: cleverapps.expBySlots[CustomSyncers.SLOT_MAIN].getExp()
    };
};

levels.User.prototype.initializeNewPlayer = function () {
    cleverapps.User.prototype.initializeNewPlayer.call(this);
    this.episode = 0;
    this.level = 0;
    this.progress = 0;
};

levels.User.GOLD_FB_CONNECT_REWARD = 100;
