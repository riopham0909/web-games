/**
 * Created by andrey on 03.08.17.
 */

var Level = function (episode, levelNo) {
    this.episode = episode;
    this.levelNo = levelNo;
    this.episodeNo = episode.episodeNo;

    this.counter = 0;

    var bundle = episode.getBundle();
    this.properties = bundle.episode.levels && bundle.episode.levels[levelNo] || {};

    this.expedition = this.properties.expedition || "main";

    if (cleverapps.config.type === "merge") {
        this.families = Families.listExpeditionCodes(this.expedition);

        this.mapSize = this.properties.mapSize;
        this.units = this.properties.units;
        this.tiles = this.properties.tiles;
    }

    this.update();
};

Level.prototype.isInteractive = function () {
    return true;
};

Level.prototype.isClickable = function () {
    if (cleverapps.config.editorMode) {
        return true;
    }

    if (this.type === Level.TYPE_NOTPASSED || !this.episode.isAvailableToPlay()) {
        return false;
    }

    if (this.type === Level.TYPE_CURRENT) {
        return true;
    }

    return this.isCurrentLevel();
};

Level.prototype.getHumanReadableNumber = function () {
    return cleverapps.humanReadableNumber(this.episodeNo, this.levelNo);
};

// will be overridden in DailyCup & BonusRound
Level.prototype.isRegular = function () {
    return this.episode.isRegular();
};

Level.prototype.isCurrentLevel = function () {
    return this.isRegular() && levels.user.isCurrentLevel(this.levelNo, this.episodeNo);
};

Level.prototype.isPassedLevel = function () {
    return levels.user.isPassedLevel(this.levelNo, this.episodeNo);
};

Level.prototype.getTag = function () {
    return this.properties.tag;
};

Level.prototype.isHard = function () {
    return this.getTag() === Level.TAGS.HARD;
};

Level.prototype.isTricky = function () {
    return this.getTag() === Level.TAGS.TRICKY;
};

Level.prototype.isBonus = function () {
    return this.getTag() === Level.TAGS.BONUS;
};

Level.prototype.getImageBundle = function () {
    return this.properties.bundleName;
};

Level.prototype.getLevelCellSkins = function () {
    return this.properties.cellSkins;
};

Level.prototype.getLevelEnemies = function () {
    var enemies = {};
    if (this.properties.enemies) {
        this.properties.enemies.forEach(function (type) {
            enemies[type] = Game.GOAL_ENEMY_TYPES[type];
        });
    }
    return enemies;
};

Level.prototype.isNew = function () {
    return this.type !== Level.TYPE_PASSED || this.isCurrentLevel();
};

Level.prototype.isLastLevelOnEpisode = function () {
    return this.episode.levels.map(function (level) {
        return level.levelNo;
    }).indexOf(this.levelNo) === this.episode.levelsPerEpisode - 1;
};

Level.prototype.getVersion = function () {
    if (this.version === undefined) {
        this.version = this.episode.getLevelContent(this.levelNo).version;
    }
    return this.version;
};

Level.prototype.load = function (callback) {
    this.counter++;

    if (this.content && !cleverapps.config.editorMode) {
        callback && callback();
    } else {
        this.episode.loadData(function () {
            this.content = this.episode.getLevelContent(this.levelNo);
            this.hash = Level.CalcHash(this.content);
            callback && callback(this);
        }.bind(this));
    }
};

Level.prototype.unload = function () {
    this.counter--;
    if (this.counter < 0) {
        this.counter = 0;
    }

    this.episode.onLevelUnload();
};

Level.CalcHash = function (levelContent) {
    return RecursiveHasher(levelContent, ["episodeNo", "levelNo", "version", "hard", "paint", "extra", "gold", "hash", "hashes", "comments", "translate", "definitions", "bundles", "horizontalCards"]);
};

Level.prototype.play = function (f, options) {
    if (cleverapps.config.editorMode) {
        this.content = undefined;
        cleverapps.environment.setScene(cleverapps.Environment.SCENE_GAME);
    }

    var scene = new GameScene({
        level: this,
        gameOptions: options
    });
    cleverapps.scenes.replaceScene(scene, f);
};

Level.prototype.onPressed = function () {
    if (cleverapps.lives && cleverapps.lives.isEmpty()) {
        cleverapps.meta.display({
            focus: ["LevelPressedNoLives", "MenuBarGoldItem", "MenuBarLivesItem"],
            action: function (f) {
                new LivesShopWindow();
                cleverapps.meta.onceNoWindowsListener = f;
            }
        });
    } else if (cleverapps.config.features.includes("boosters_before") && !WindowBoostersBefore.isAvailable() && this.isCurrentLevel() && !this.isHard()
            || !LevelStartWindow.isAvailable(this.episodeNo, this.levelNo)) {
        cleverapps.meta.display({
            focus: "LevelPressedPlay",
            action: function (f) {
                this.play(f);
            }.bind(this)
        });
    } else if (!this.episode.isComingSoon()) {
        cleverapps.meta.display({
            focus: "LevelStartWindow",
            control: "MenuBarGoldItem",
            actions: [
                function (f) {
                    new LevelStartWindow({
                        level: this
                    });
                    cleverapps.meta.onceNoWindowsListener = f;
                }.bind(this)
            ]
        });
    }
};

Level.prototype.update = function () {
    if (cleverapps.meta.getType() !== Metha.HOSE && cleverapps.meta.getType() !== Metha.SHORTMETA) {
        this.type = Level.TYPE_CURRENT;
        return;
    }

    var episodeNo = levels.user.episode;
    var levelNo = levels.user.level;

    if (cleverapps.meta.getType() === Metha.SHORTMETA) {
        episodeNo = Math.floor(cleverapps.meta.getMainObject().level / Episode.LEVELS_PER_EPISODE);
        levelNo = cleverapps.meta.getMainObject().level % Episode.LEVELS_PER_EPISODE;
    }

    if (episodeNo > this.episodeNo) {
        this.type = Level.TYPE_PASSED;
    } else if (episodeNo < this.episodeNo) {
        this.type = Level.TYPE_NOTPASSED;
    } else if (levelNo > this.levelNo) {
        this.type = Level.TYPE_PASSED;
    } else if (levelNo === this.levelNo) {
        this.type = Level.TYPE_CURRENT;
    } else {
        this.type = Level.TYPE_NOTPASSED;
    }

    this.stars = (this.type === Level.TYPE_PASSED) ? 3 : 0;
};

Level.prototype.nextLevel = function () {
    if (this.building) {
        return this;
    }

    var episodeNo = this.episodeNo;
    var levelNo = this.levelNo + 1;

    if (levelNo >= Episode.LEVELS_PER_EPISODE) {
        levelNo = 0;
        episodeNo += 1;
    }

    return MethaHelper.getLevel(episodeNo, levelNo);
};

Level.AvailableTags = function () {
    if (cleverapps.config.subtype === "stacks") {
        return [Level.TAGS.HARD, Level.TAGS.TRICKY];
    }

    if (cleverapps.config.type === "board") {
        return [Level.TAGS.HARD, Level.TAGS.BONUS];
    }

    if (cleverapps.config.type === "match3") {
        return [Level.TAGS.HARD, Level.TAGS.TRICKY, Level.TAGS.BONUS];
    }

    return [Level.TAGS.HARD];
};

Level.TYPE_PASSED = 0;
Level.TYPE_CURRENT = 1;
Level.TYPE_NOTPASSED = 2;

Level.TAGS = {};
Level.TAGS.HARD = "hard";
Level.TAGS.TRICKY = "tricky";
Level.TAGS.BONUS = "bonus";

if (typeof cc === "undefined") {
    module.exports = Level;
}
