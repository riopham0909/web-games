/**
 * Created by slava on 24.03.17.
 */

if (typeof cc === "undefined") {
    var cleverapps = require("../../utils/utils");
}

var Episode = function (episodeNo, levelNo, options) {
    options = options || {};

    this.episodeNo = episodeNo;
    this.levelNo = levelNo;
    if (cleverapps.config.features.includes("highscore")) {
        this.episodeNo = 0;
        this.levelNo = 0;
    }
    this.type = options.type ? options.type : Episode.CalcType(episodeNo);
    this.copyData = options.copyData;

    this.whenRemovedListeners = [];

    this.loadTasks = {};

    this.init();
};

Episode.CalcType = function (episodeNo) {
    if (typeof BonusWorld !== "undefined" && BonusWorld.getConfigByEpisode(episodeNo)) {
        return Episode.Types.BONUS_WORLD;
    }

    if (Episode.TypeValues[episodeNo]) {
        return episodeNo;
    }

    return Episode.Types.REGULAR;
};

Episode.prototype.isComingSoon = function () {
    return this.episodeNo === cleverapps.episodes.getAmountEpisodes() && cleverapps.isLevels();
};

Episode.prototype.init = function () {
    this.loaded = false;

    var bundle = bundles[this.bundleId()];

    if (!bundle) {
        throw new Error("no bundle for episode " + this.episodeNo + " " + this.levelNo + " " + cleverapps.settings.language);
    }

    this.levelsPerEpisode = bundle.episode.levelsAmount;

    if (this.isComingSoon() || this.levelNo !== undefined) {
        this.levelsPerEpisode = 1;
    }

    var levelNumbers = this.levelNo !== undefined ? [this.levelNo] : cleverapps.rangeArray(0, this.levelsPerEpisode - 1);
    this.levels = levelNumbers.map(function (levelNo) {
        return new Level(this, levelNo);
    }.bind(this));
};

Episode.prototype.getLevel = function (levelNo) {
    if (this.levelNo !== undefined) {
        levelNo = 0;
    }
    return this.levels[levelNo];
};

Episode.prototype.isRegular = function () {
    return this.type === Episode.Types.REGULAR;
};

Episode.prototype.getCurrentLevel = function () {
    for (var i in this.levels) {
        var level = this.levels[i];
        if (level.type === Level.TYPE_CURRENT) {
            return level;
        }
    }
};

Episode.prototype.whenRemoved = function (callback) {
    this.whenRemovedListeners.push(callback);
};

Episode.prototype.isPassed = function () {
    return levels.user.episode > this.episodeNo;
};

Episode.prototype.isCurrent = function () {
    return levels.user.episode === this.episodeNo;
};

Episode.prototype.destructor = function () {
    if (this.deleted) {
        return;
    }

    for (var taskName in this.loadTasks) {
        var task = this.loadTasks[taskName];
        task.destructor();
    }

    this.loadTasks = {};

    this.whenRemovedListeners.forEach(cleverapps.callFunc);
    this.whenRemovedListeners = [];

    this.deleted = true;
};

Episode.prototype.onLevelUnload = function () {
    var counter = this.levels.reduce(function (sum, level) {
        return sum + level.counter;
    }, 0);

    if (counter <= 0) {
        this.destructor();
    }
};

Episode.BundleId = function (episodeNo, language) {
    language = language || cleverapps.settings.language;
    var name = "episode_" + episodeNo;
    if (cleverapps.config.type === "board" && language !== "en") {
        name += "_" + language;
    }
    return name;
};

Episode.prototype.bundleId = function () {
    if (!cleverapps.config.adminMode && this.isComingSoon()) {
        return "episode_coming_soon";
    }
    return Episode.BundleId(this.episodeNo);
};

Episode.prototype.isLoading = function () {
    for (var taskName in this.loadTasks) {
        if (this.loadTasks[taskName].isActive()) {
            return true;
        }
    }
};

Episode.prototype.loadData = function (callback) {
    this.loadBundles("levels", [this.bundleId()], callback);
};

Episode.prototype.loadBundles = function (task, bundles, callback) {
    if (this.deleted) {
        callback && callback();
        return;
    }

    if (!this.loadTasks[task]) {
        this.loadTasks[task] = new SuccessWait(bundles);
    }

    this.loadTasks[task].whenLoaded(callback);
};

Episode.prototype.getBundle = function () {
    return bundles[this.bundleId()];
};

Episode.prototype.getContent = function () {
    if (this.content) {
        return this.content;
    }

    this.content = cc.loader.getRes(this.getBundle().jsons.levels);

    if (this.copyData) {
        this.content = JSON.parse(JSON.stringify(this.content));
    }

    return this.content;
};

Episode.prototype.getLevels = function () {
    var content = this.getContent();

    if (!content) {
        throw new Error("No content for episode " + this.episodeNo + " scene " + cleverapps.environment.scene
            + " loaded " + (this.loadTasks.levels && (this.loadTasks.levels.loaded + " " + this.loadTasks.levels.active))
            + " bundle " + this.bundleId() + " " + cleverapps.bundleLoader.isLoaded(this.bundleId()));
    }

    return Array.isArray(content) ? content : content.levels;
};

Episode.prototype.isDebug = function () {
    var content = this.getContent();
    return content.debug;
};

Episode.prototype.getHashes = function () {
    var hashes = {};
    this.getLevels().forEach(function (level, levelNo) {
        Object.assign(hashes, this.getLevelHashes(levelNo));
    }.bind(this));
    return hashes;
};

Episode.prototype.getLevelHashes = function (levelNo) {
    var hashes = {};

    var versions = this.getLevelVersions(levelNo);
    Object.keys(versions).map(cleverapps.castType).sort().forEach(function (version) {
        var content = versions[version];
        var hash = Level.CalcHash(content);
        hashes[hash] = {
            levelNo: levelNo,
            version: version,
            hash: hash
        };
    });

    return hashes;
};

Episode.prototype.getLastVersionHashes = function () {
    return this.levels.map(function (lvl) {
        var content = this.getLevelContent(lvl.levelNo);
        return Level.CalcHash(content);
    }, this);
};

Episode.prototype.getLevelVersions = function (levelNo) {
    var episodeLevels = this.getLevels();

    if (!episodeLevels || !episodeLevels[levelNo]) {
        cleverapps.throwAsync("No levels for episode " + this.episodeNo + " level " + levelNo);
    }

    var content = episodeLevels[levelNo];
    if (!Array.isArray(content)) {
        content = [content];
    }

    var versions = {};
    content.forEach(function (level, index) {
        var version = level.version || index;
        versions[version] = level;
    });
    return versions;
};

Episode.prototype.getMaxVersion = function (versions) {
    var maxVersion = 0;
    for (var version in versions) {
        maxVersion = Math.max(maxVersion, parseInt(version));
    }
    return maxVersion;
};

Episode.prototype.getLevelContent = function (levelNo) {
    var versions = this.getLevelVersions(levelNo);
    var activeVersion = this.getMaxVersion(versions);

    if (cleverapps.config.editorMode && LevelManager.getInstance().version !== undefined
        && !(cleverapps.environment.isMainScene() && !cleverapps.travelBook.isExpedition())) {
        activeVersion = LevelManager.getInstance().version;
    }

    var content = versions[activeVersion];

    content.episodeNo = this.episodeNo;
    content.levelNo = levelNo;
    content.version = activeVersion;
    return content;
};

Episode.prototype.isDailyCup = function () {
    return this.type === Episode.Types.DAILYCUP;
};

Episode.prototype.isBonusRound = function () {
    return this.type === Episode.Types.BONUSROUNDS;
};

Episode.prototype.isDailyLevel = function () {
    return this.type === Episode.Types.DAILY_LEVELS;
};

Episode.prototype.isBonusWorldLevel = function () {
    return this.type === Episode.Types.BONUS_WORLD;
};

Episode.prototype.isAdsLevel = function () {
    return this.type === Episode.Types.ADS || this.type === Episode.Types.PROMO;
};

Episode.LevelChooseAlgorithm = function (options) {
    var start = options.start;
    var finish = options.finish || cleverapps.episodes.getAmountEpisodes();

    var seed = options.seed;

    var firstLevelNo = start * Episode.LEVELS_PER_EPISODE;
    var lastLevelNo = finish * Episode.LEVELS_PER_EPISODE - 1;

    var level = cleverapps.Random.random(firstLevelNo, lastLevelNo, seed);

    return {
        levelNo: level % Episode.LEVELS_PER_EPISODE,
        episodeNo: Math.floor(level / Episode.LEVELS_PER_EPISODE)
    };
};

Episode.IsDebug = function (content) {
    if (["none"].indexOf(cleverapps.config.meta) === -1 && cleverapps.config.features.indexOf("highscore") === -1 && content.levels.length < Episode.LEVELS_PER_EPISODE) {
        return true;
    }

    if (content.debug) {
        return true;
    }
};

Episode.prototype.isAvailableToPlay = function () {
    if (cleverapps.config.editorMode) {
        return true;
    }

    if (cleverapps.meta.getType() === Metha.HOSE) {
        return levels.user.episode >= this.episodeNo;
    }

    return true;
};

Episode.LEVELS_PER_EPISODE = 15;

Episode.Types = {
    REGULAR: "regular",
    BONUSROUNDS: "bonusrounds",
    EDITOR: "editor",
    DAILY_LEVELS: "daily_levels",
    DAILYCUP: "dailycup",
    BONUS_WORLD: "bonus_world",
    ADS: "ads",
    PROMO: "promo",
    PLAYABLE_ADS: "playable_ads",
    ADS_HALLOWEEN: "ads_halloween",
    ADS_XMAS: "ads_xmas",
    ADS_DRAGONIA: "ads_dragonia",
    ADS_UNDERSEA: "ads_undersea",
    ADS_UNDERSEA2: "ads_undersea2",
    ADS_RAPUNZEL: "ads_rapunzel",
    ADS_RAPUNZEL2: "ads_rapunzel2"
};

Episode.TypeValues = cleverapps.createSet(cleverapps.values(Episode.Types));

if (typeof cc === "undefined") {
    module.exports = Episode;
}
